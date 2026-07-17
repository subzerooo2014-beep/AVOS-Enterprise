import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  MeshNode,
  MeshNodeStatus,
  MeshRouteKind
} from "../contracts/enterprise-intelligence-mesh.contracts";
import type { RegisterMeshNodeDto } from "../dto/enterprise-intelligence-mesh.dto";
import { MeshIdService } from "./mesh-id.service";

@Injectable()
export class MeshRegistryService {
  private readonly nodes = new Map<string, MeshNode>();

  constructor(private readonly ids: MeshIdService) {
    this.seed();
  }

  private seed(): void {
    const nodes: RegisterMeshNodeDto[] = [
      {
        id: "enterprise-kernel",
        name: "AVOS Enterprise Kernel",
        kind: "kernel",
        version: "1.0.0",
        actions: ["health", "diagnostics", "supervise", "govern"],
        dependencies: []
      },
      {
        id: "capability-fabric",
        name: "AVOS Capability Fabric",
        kind: "capability",
        version: "1.0.0",
        actions: ["discover", "invoke", "graph", "validate"],
        dependencies: ["enterprise-kernel"]
      },
      {
        id: "knowledge-fabric",
        name: "AVOS Knowledge Fabric",
        kind: "knowledge",
        version: "1.0.0",
        actions: ["search", "ingest", "retrieve", "reason"],
        dependencies: ["enterprise-kernel"]
      },
      {
        id: "enterprise-decision-intelligence",
        name: "AVOS Enterprise Decision Intelligence",
        kind: "decision",
        version: "1.0.0",
        actions: ["evaluate", "recommend", "approve", "execute"],
        dependencies: ["knowledge-fabric", "enterprise-kernel"]
      },
      {
        id: "autonomous-orchestration",
        name: "AVOS Autonomous Orchestration",
        kind: "orchestration",
        version: "1.0.0",
        actions: ["plan", "start", "advance", "complete"],
        dependencies: ["capability-fabric", "enterprise-decision-intelligence"]
      },
      {
        id: "enterprise-nervous-system",
        name: "AVOS Enterprise Nervous System",
        kind: "event",
        version: "1.0.0",
        actions: ["publish", "replay", "subscribe", "signal"],
        dependencies: ["enterprise-kernel"]
      },
      {
        id: "enterprise-memory",
        name: "AVOS Enterprise Memory",
        kind: "memory",
        version: "1.0.0",
        actions: ["store", "search", "consolidate", "recall"],
        dependencies: ["knowledge-fabric"]
      }
    ];

    for (const node of nodes) {
      this.register(node);
    }
  }

  register(dto: RegisterMeshNodeDto): MeshNode {
    const now = this.ids.now();
    const existing = this.nodes.get(dto.id);

    const node: MeshNode = {
      id: dto.id,
      name: dto.name,
      kind: dto.kind,
      status: existing?.status ?? "online",
      version: dto.version ?? "1.0.0",
      actions: [...dto.actions],
      dependencies: [...(dto.dependencies ?? [])],
      metadata: { ...(dto.metadata ?? {}) },
      registeredAt: existing?.registeredAt ?? now,
      lastSeenAt: now
    };

    this.nodes.set(node.id, node);
    return node;
  }

  list(kind?: MeshRouteKind): MeshNode[] {
    return [...this.nodes.values()]
      .filter((node) => !kind || node.kind === kind)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get(id: string): MeshNode {
    const node = this.nodes.get(id);
    if (!node) {
      throw new NotFoundException(`Mesh node not found: ${id}`);
    }
    return node;
  }

  findRoute(kind: MeshRouteKind, action: string): MeshNode | undefined {
    return this.list(kind).find(
      (node) => node.status !== "offline" && node.actions.includes(action)
    );
  }

  heartbeat(id: string, status: MeshNodeStatus = "online"): MeshNode {
    const current = this.get(id);
    const updated: MeshNode = {
      ...current,
      status,
      lastSeenAt: this.ids.now()
    };
    this.nodes.set(id, updated);
    return updated;
  }

  graph(): {
    nodes: MeshNode[];
    edges: Array<{ from: string; to: string; relation: "depends-on" }>;
  } {
    const nodes = this.list();
    const edges = nodes.flatMap((node) =>
      node.dependencies.map((dependency) => ({
        from: node.id,
        to: dependency,
        relation: "depends-on" as const
      }))
    );

    return { nodes, edges };
  }
}