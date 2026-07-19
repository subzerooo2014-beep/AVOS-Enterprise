import { Injectable } from "@nestjs/common";
import { RuntimeFleetNode } from "./platform-production-mega-pack-3.types";
import { OperationsFileStoreService } from "./operations-file-store.service";

@Injectable()
export class RuntimeFleetManagementService {
  constructor(
    private readonly store: OperationsFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const nodes = [
      {
        runtimeKey: "unified-platform-runtime",
        instanceName: "platform-runtime-prod-01",
        environment: "production" as const,
        region: "global",
        zone: "runtime",
        status: "online" as const,
        version: "PPI-MP1-1.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 35,
        tags: ["platform", "runtime", "critical"],
      },
      {
        runtimeKey: "enterprise-service-mesh",
        instanceName: "service-mesh-prod-01",
        environment: "production" as const,
        region: "global",
        zone: "mesh",
        status: "online" as const,
        version: "PPI-MP2-1.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 30,
        tags: ["mesh", "routing", "critical"],
      },
      {
        runtimeKey: "capability-fabric",
        instanceName: "capability-fabric-prod-01",
        environment: "production" as const,
        region: "global",
        zone: "fabric",
        status: "online" as const,
        version: "CF-1.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 25,
        tags: ["capability", "fabric"],
      },
      {
        runtimeKey: "knowledge-fabric",
        instanceName: "knowledge-fabric-prod-01",
        environment: "production" as const,
        region: "global",
        zone: "fabric",
        status: "online" as const,
        version: "KF-6.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 25,
        tags: ["knowledge", "fabric"],
      },
      {
        runtimeKey: "intelligence-fabric",
        instanceName: "intelligence-fabric-prod-01",
        environment: "production" as const,
        region: "global",
        zone: "fabric",
        status: "online" as const,
        version: "IF-6.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 20,
        tags: ["intelligence", "fabric"],
      },
    ];

    for (const node of nodes) {
      this.register(node);
    }
  }

  register(
    input: Omit<RuntimeFleetNode, "id" | "createdAt" | "updatedAt">,
  ): RuntimeFleetNode {
    const existing = this.list().find(
      (item) => item.instanceName === input.instanceName,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const node: RuntimeFleetNode = {
      ...input,
      id: this.id("fleet-node"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`fleet/${node.id}.json`, node);
    return node;
  }

  list(): RuntimeFleetNode[] {
    return this.store.listJson<RuntimeFleetNode>("fleet");
  }

  update(
    id: string,
    patch: Partial<RuntimeFleetNode>,
  ): RuntimeFleetNode {
    const node = this.list().find((item) => item.id === id);

    if (!node) {
      throw new Error(`Fleet node not found: ${id}`);
    }

    const updated: RuntimeFleetNode = {
      ...node,
      ...patch,
      healthScore:
        patch.healthScore === undefined
          ? node.healthScore
          : Math.max(0, Math.min(100, patch.healthScore)),
      workload:
        patch.workload === undefined
          ? node.workload
          : Math.max(0, Math.min(node.capacity, patch.workload)),
      updatedAt: this.now(),
    };

    this.store.writeJson(`fleet/${updated.id}.json`, updated);
    return updated;
  }

  heartbeat(id: string, healthScore = 100): RuntimeFleetNode {
    return this.update(id, {
      status:
        healthScore >= 90
          ? "online"
          : healthScore >= 60
            ? "draining"
            : "offline",
      healthScore,
      lastHeartbeatAt: this.now(),
    });
  }

  scale(
    runtimeKey: string,
    desiredInstances: number,
    environment: RuntimeFleetNode["environment"],
  ): RuntimeFleetNode[] {
    const existing = this.list().filter(
      (node) =>
        node.runtimeKey === runtimeKey &&
        node.environment === environment,
    );

    const target = Math.max(1, desiredInstances);

    while (existing.length < target) {
      const node = this.register({
        runtimeKey,
        instanceName: `${runtimeKey}-${environment}-${existing.length + 1}`,
        environment,
        region: "global",
        zone: "auto",
        status: "online",
        version: existing[0]?.version ?? "1.0.0",
        healthScore: 100,
        capacity: 100,
        workload: 0,
        tags: ["auto-scaled"],
      });

      existing.push(node);
    }

    return existing.slice(0, target);
  }
}