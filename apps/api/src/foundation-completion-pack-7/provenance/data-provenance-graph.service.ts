import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  ProvenanceEdge,
  ProvenanceNode,
  ProvenanceNodeType,
  ProvenanceRelationType
} from "../foundation-pack-7.types";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class DataProvenanceGraphService {
  private readonly nodes = new Map<string, ProvenanceNode>();
  private readonly edges = new Map<string, ProvenanceEdge>();

  constructor(
    private readonly audit: TrustAuditLedgerService
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
      throw new NotFoundException(`Provenance node not found: ${id}`);
    }

    return node;
  }

  createNode(input: {
    id?: string;
    type: ProvenanceNodeType;
    label: string;
    sourceSystem: string;
    ownerIdentityId?: string;
    contentHash?: string;
    metadata?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();
    const node: ProvenanceNode = {
      id:
        input.id ??
        `provenance-node:${Date.now()}:${this.nodes.size + 1}`,
      type: input.type,
      label: input.label,
      sourceSystem: input.sourceSystem,
      ownerIdentityId: input.ownerIdentityId,
      contentHash: input.contentHash,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: input.correlationId,
      category: "provenance",
      action: "provenance-node-created",
      subjectId: node.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      after: {
        type: node.type,
        sourceSystem: node.sourceSystem,
        contentHash: node.contentHash
      },
      metadata: {}
    });

    return node;
  }

  createEdge(input: {
    fromNodeId: string;
    toNodeId: string;
    relation: ProvenanceRelationType;
    actorIdentityId: string;
    correlationId: string;
    metadata?: Record<string, unknown>;
  }) {
    if (input.fromNodeId === input.toNodeId) {
      throw new BadRequestException(
        "A provenance node cannot link to itself."
      );
    }

    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    const duplicate = this.listEdges().find(
      (edge) =>
        edge.fromNodeId === input.fromNodeId &&
        edge.toNodeId === input.toNodeId &&
        edge.relation === input.relation
    );

    if (duplicate) {
      return duplicate;
    }

    const edge: ProvenanceEdge = {
      id: `provenance-edge:${Date.now()}:${this.edges.size + 1}`,
      fromNodeId: input.fromNodeId,
      toNodeId: input.toNodeId,
      relation: input.relation,
      actorIdentityId: input.actorIdentityId,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.edges.set(edge.id, edge);

    this.audit.record({
      correlationId: input.correlationId,
      category: "provenance",
      action: "provenance-edge-created",
      subjectId: edge.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      after: {
        fromNodeId: edge.fromNodeId,
        toNodeId: edge.toNodeId,
        relation: edge.relation
      },
      metadata: {}
    });

    return edge;
  }

  lineage(nodeId: string) {
    this.getNode(nodeId);

    const visited = new Set<string>();
    const queue = [nodeId];
    const nodes: ProvenanceNode[] = [];
    const edges: ProvenanceEdge[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift();

      if (!currentId || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      nodes.push(this.getNode(currentId));

      const related = this.listEdges().filter(
        (edge) =>
          edge.fromNodeId === currentId ||
          edge.toNodeId === currentId
      );

      for (const edge of related) {
        if (!edges.some((candidate) => candidate.id === edge.id)) {
          edges.push(edge);
        }

        const otherId =
          edge.fromNodeId === currentId
            ? edge.toNodeId
            : edge.fromNodeId;

        if (!visited.has(otherId)) {
          queue.push(otherId);
        }
      }
    }

    return {
      rootNodeId: nodeId,
      nodes,
      edges
    };
  }

  hasLineage(nodeId: string) {
    return this.nodes.has(nodeId) &&
      this.listEdges().some(
        (edge) =>
          edge.fromNodeId === nodeId ||
          edge.toNodeId === nodeId
      );
  }

  summary() {
    return {
      nodes: this.nodes.size,
      edges: this.edges.size,
      dataAssets: this.listNodes().filter(
        (node) => node.type === "data-asset"
      ).length,
      decisions: this.listNodes().filter(
        (node) => node.type === "decision"
      ).length
    };
  }
}
