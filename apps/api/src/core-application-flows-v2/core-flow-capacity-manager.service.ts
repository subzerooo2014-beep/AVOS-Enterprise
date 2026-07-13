import { Injectable } from "@nestjs/common";
import type { CapacityDecision } from "./core-flow-cluster.types";
import { CoreFlowClusterRegistryService } from "./core-flow-cluster-registry.service";
import { CoreFlowDurableRuntimeService } from "./core-flow-durable-runtime.service";

@Injectable()
export class CoreFlowCapacityManagerService {
  constructor(
    private readonly registry: CoreFlowClusterRegistryService,
    private readonly runtime: CoreFlowDurableRuntimeService,
  ) {}

  async decide(): Promise<CapacityDecision> {
    const nodes = await this.registry.findAll();
    const dashboard = await this.runtime.dashboard();
    const currentWorkers = nodes.filter((node: any) =>
      ["active", "leader", "degraded"].includes(node.status),
    ).length;
    const queued = Number(dashboard.queued ?? 0);
    const desiredWorkers = Math.max(1, Math.ceil(queued / 25));

    const scaleAction: CapacityDecision["scaleAction"] =
      desiredWorkers > currentWorkers
        ? "scale-up"
        : desiredWorkers < currentWorkers
          ? "scale-down"
          : "hold";

    return {
      desiredWorkers,
      currentWorkers,
      scaleAction,
      reason: `queued=${queued}; current=${currentWorkers}; desired=${desiredWorkers}`,
      decidedAt: new Date().toISOString(),
    };
  }

  async dashboard() {
    return {
      decision: await this.decide(),
      nodes: await this.registry.findAll(),
      runtime: await this.runtime.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
