import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  LivingBlueprintEdge,
  LivingBlueprintNode,
} from "../contracts/living-blueprint.contracts";
import {
  LinkBlueprintNodeDto,
  RegisterBlueprintNodeDto,
  UpdateBlueprintRuntimeDto,
} from "../dto/living-blueprint.dto";

@Injectable()
export class LivingBlueprintRegistryService {
  private readonly nodes = new Map<string, LivingBlueprintNode>();
  private readonly edges = new Map<string, LivingBlueprintEdge>();
  private nodeSequence = 0;
  private edgeSequence = 0;

  constructor() {
    const enterprise = this.registerNode({
      key: "avos-enterprise",
      name: "AVOS Enterprise",
      type: "platform",
      layer: "foundation",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: ["enterprise-orchestration", "platform-governance"],
      contracts: ["platform-contract"],
      policies: ["human-final-authority"],
      runtime: { availability: 100, environment: "enterprise" },
    });

    const kernel = this.registerNode({
      key: "enterprise-kernel",
      name: "AVOS Enterprise Kernel",
      type: "kernel",
      layer: "foundation",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: ["lifecycle", "health", "diagnostics", "orchestration"],
      contracts: ["kernel-contract"],
      policies: ["audit-by-design"],
      runtime: { status: "operational", healthScore: 100 },
    });

    const identity = this.registerNode({
      key: "digital-identity-os",
      name: "AVOS Digital Identity OS",
      type: "capability",
      layer: "identity",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: ["universal-identity", "digital-dna", "identity-governance"],
      contracts: ["identity-contract"],
      policies: ["identity-traceability", "human-final-authority"],
      runtime: { status: "certified", score: 100 },
    });

    const metadata = this.registerNode({
      key: "enterprise-metadata",
      name: "AVOS Enterprise Metadata & Dependency Graph",
      type: "fabric",
      layer: "metadata",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: ["metadata-registry", "dependency-graph", "lineage", "impact-analysis"],
      contracts: ["metadata-contract"],
      policies: ["metadata-governance"],
      runtime: { status: "healthy", score: 88 },
    });

    const architectureIntelligence = this.registerNode({
      key: "architecture-intelligence",
      name: "AVOS Architecture Intelligence Engine",
      type: "engine",
      layer: "architecture-intelligence",
      version: "1.0.0",
      owner: "AVOS Enterprise",
      capabilities: [
        "architecture-analysis",
        "drift-detection",
        "compatibility-analysis",
        "upgrade-readiness",
      ],
      contracts: ["architecture-intelligence-contract"],
      policies: ["architecture-governance", "human-final-authority"],
      runtime: { status: "certified", score: 100, riskLevel: "low" },
    });

    this.linkNodes({
      sourceId: kernel.id,
      targetId: enterprise.id,
      type: "depends-on",
      critical: true,
    });

    this.linkNodes({
      sourceId: identity.id,
      targetId: kernel.id,
      type: "depends-on",
      critical: true,
    });

    this.linkNodes({
      sourceId: metadata.id,
      targetId: kernel.id,
      type: "depends-on",
      critical: true,
    });

    this.linkNodes({
      sourceId: architectureIntelligence.id,
      targetId: metadata.id,
      type: "consumes",
      critical: true,
    });
  }

  registerNode(input: RegisterBlueprintNodeDto): LivingBlueprintNode {
    const key = input.key?.trim().toLowerCase();

    if (!key || !input.name?.trim() || !input.layer?.trim()) {
      throw new BadRequestException("key, name, and layer are required");
    }

    if ([...this.nodes.values()].some((node) => node.key === key)) {
      throw new BadRequestException(`Blueprint node key already exists: ${key}`);
    }

    const now = new Date().toISOString();

    const node: LivingBlueprintNode = {
      id: `living-blueprint-node:${Date.now()}:${++this.nodeSequence}`,
      key,
      name: input.name.trim(),
      type: input.type,
      layer: input.layer.trim(),
      status: input.status ?? "active",
      version: input.version ?? "1.0.0",
      owner: input.owner ?? "AVOS Enterprise",
      capabilities: [...(input.capabilities ?? [])],
      contracts: [...(input.contracts ?? [])],
      policies: [...(input.policies ?? [])],
      runtime: { ...(input.runtime ?? {}) },
      metadata: { ...(input.metadata ?? {}) },
      createdAt: now,
      updatedAt: now,
    };

    this.nodes.set(node.id, node);
    return node;
  }

  updateRuntime(id: string, input: UpdateBlueprintRuntimeDto): LivingBlueprintNode {
    const current = this.getNode(id);

    const updated: LivingBlueprintNode = {
      ...current,
      status: input.status ?? current.status,
      runtime: { ...current.runtime, ...(input.runtime ?? {}) },
      metadata: { ...current.metadata, ...(input.metadata ?? {}) },
      updatedAt: new Date().toISOString(),
    };

    this.nodes.set(id, updated);
    return updated;
  }

  linkNodes(input: LinkBlueprintNodeDto): LivingBlueprintEdge {
    if (input.sourceId === input.targetId) {
      throw new BadRequestException("Self dependencies are not allowed");
    }

    this.getNode(input.sourceId);
    this.getNode(input.targetId);

    const duplicate = [...this.edges.values()].find(
      (edge) =>
        edge.sourceId === input.sourceId &&
        edge.targetId === input.targetId &&
        edge.type === input.type,
    );

    if (duplicate) {
      throw new BadRequestException("Blueprint edge already exists");
    }

    const edge: LivingBlueprintEdge = {
      id: `living-blueprint-edge:${Date.now()}:${++this.edgeSequence}`,
      sourceId: input.sourceId,
      targetId: input.targetId,
      type: input.type,
      critical: input.critical ?? false,
      metadata: { ...(input.metadata ?? {}) },
      createdAt: new Date().toISOString(),
    };

    this.edges.set(edge.id, edge);
    return edge;
  }

  listNodes(): readonly LivingBlueprintNode[] {
    return [...this.nodes.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  listEdges(): readonly LivingBlueprintEdge[] {
    return [...this.edges.values()];
  }

  getNode(id: string): LivingBlueprintNode {
    const node = this.nodes.get(id);
    if (!node) throw new NotFoundException(`Blueprint node not found: ${id}`);
    return node;
  }

  getEdge(id: string): LivingBlueprintEdge {
    const edge = this.edges.get(id);
    if (!edge) throw new NotFoundException(`Blueprint edge not found: ${id}`);
    return edge;
  }

  findNodeByKey(key: string): LivingBlueprintNode | undefined {
    return [...this.nodes.values()].find(
      (node) => node.key === key.trim().toLowerCase(),
    );
  }

  incomingEdges(nodeId: string): readonly LivingBlueprintEdge[] {
    return this.listEdges().filter((edge) => edge.targetId === nodeId);
  }

  outgoingEdges(nodeId: string): readonly LivingBlueprintEdge[] {
    return this.listEdges().filter((edge) => edge.sourceId === nodeId);
  }
}