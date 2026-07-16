import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  DependencyCriticality,
  DependencyEdge,
  DependencyNode,
  DependencyRelation,
  MetadataAssetType
} from "../foundation-pack-9.types";
import { DigitalIdentityRegistryService } from "../identity/digital-identity-registry.service";
import { EnterpriseMetadataRegistryService } from "../metadata/enterprise-metadata-registry.service";
import { CapabilityContractRegistryService } from "../contracts/capability-contract-registry.service";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class EnterpriseDependencyGraphService {
  private readonly nodes = new Map<string, DependencyNode>();
  private readonly edges = new Map<string, DependencyEdge>();

  constructor(
    private readonly identities: DigitalIdentityRegistryService,
    private readonly metadata: EnterpriseMetadataRegistryService,
    private readonly contracts: CapabilityContractRegistryService,
    private readonly audit: Foundation9AuditService
  ) {}

  listNodes() {
    return Array.from(this.nodes.values());
  }

  listEdges() {
    return Array.from(this.edges.values());
  }

  getNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(
        `Dependency node not found: ${id}`
      );
    }

    return node;
  }

  createNode(input: {
    id?: string;
    identityId: string;
    assetType: MetadataAssetType;
    label: string;
    version: string;
    metadataRecordId?: string;
    correlationId: string;
    actorIdentityId: string;
  }) {
    this.identities.get(input.identityId);

    if (input.metadataRecordId) {
      this.metadata.get(input.metadataRecordId);
    }

    const now = new Date().toISOString();

    const node: DependencyNode = {
      id:
        input.id ??
        `dependency-node:${Date.now()}:${this.nodes.size + 1}`,
      identityId: input.identityId,
      assetType: input.assetType,
      label: input.label,
      version: input.version,
      active: true,
      metadataRecordId: input.metadataRecordId,
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dependency",
      action: "dependency-node-created",
      subjectId: node.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        identityId: node.identityId,
        assetType: node.assetType
      }
    });

    return node;
  }

  createEdge(input: {
    fromNodeId: string;
    toNodeId: string;
    relation: DependencyRelation;
    criticality: DependencyCriticality;
    required: boolean;
    versionConstraint?: string;
    contractId?: string;
    metadata?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    if (input.fromNodeId === input.toNodeId) {
      throw new BadRequestException(
        "A dependency node cannot depend on itself."
      );
    }

    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    if (input.contractId) {
      this.contracts.get(input.contractId);
    }

    const duplicate = this.listEdges().find(
      (edge) =>
        edge.fromNodeId === input.fromNodeId &&
        edge.toNodeId === input.toNodeId &&
        edge.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const now = new Date().toISOString();

    const edge: DependencyEdge = {
      id: `dependency-edge:${Date.now()}:${this.edges.size + 1}`,
      fromNodeId: input.fromNodeId,
      toNodeId: input.toNodeId,
      relation: input.relation,
      criticality: input.criticality,
      required: input.required,
      versionConstraint: input.versionConstraint,
      contractId: input.contractId,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.edges.set(edge.id, edge);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dependency",
      action: "dependency-edge-created",
      subjectId: edge.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        relation: edge.relation,
        criticality: edge.criticality,
        required: edge.required
      }
    });

    return edge;
  }

  outgoing(nodeId: string) {
    this.getNode(nodeId);

    return this.listEdges().filter(
      (edge) => edge.fromNodeId === nodeId
    );
  }

  incoming(nodeId: string) {
    this.getNode(nodeId);

    return this.listEdges().filter(
      (edge) => edge.toNodeId === nodeId
    );
  }

  neighborhood(nodeId: string) {
    const node = this.getNode(nodeId);
    const outgoing = this.outgoing(nodeId);
    const incoming = this.incoming(nodeId);

    const relatedNodeIds = Array.from(
      new Set([
        ...outgoing.map((edge) => edge.toNodeId),
        ...incoming.map((edge) => edge.fromNodeId)
      ])
    );

    return {
      node,
      outgoing,
      incoming,
      relatedNodes: relatedNodeIds.map((id) => this.getNode(id))
    };
  }

  detectCycles() {
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];

    const visit = (nodeId: string, path: string[]) => {
      if (visiting.has(nodeId)) {
        const index = path.indexOf(nodeId);
        cycles.push([...path.slice(index), nodeId]);
        return;
      }

      if (visited.has(nodeId)) {
        return;
      }

      visiting.add(nodeId);
      path.push(nodeId);

      for (const edge of this.outgoing(nodeId)) {
        visit(edge.toNodeId, [...path]);
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
    };

    for (const node of this.listNodes()) {
      visit(node.id, []);
    }

    return cycles;
  }

  summary() {
    const edges = this.listEdges();

    return {
      nodes: this.nodes.size,
      edges: this.edges.size,
      requiredEdges: edges.filter(
        (edge) => edge.required
      ).length,
      criticalEdges: edges.filter(
        (edge) => edge.criticality === "critical"
      ).length,
      contractsLinked: edges.filter(
        (edge) => Boolean(edge.contractId)
      ).length,
      cycles: this.detectCycles().length
    };
  }
}
