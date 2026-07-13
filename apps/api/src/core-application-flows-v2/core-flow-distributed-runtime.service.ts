import { Injectable } from "@nestjs/common";
import { CoreFlowLeaderElectionService } from "./core-flow-leader-election.service";
import { CoreFlowClusterRegistryService } from "./core-flow-cluster-registry.service";
import { CoreFlowDistributedSchedulerService } from "./core-flow-distributed-scheduler.service";
import { CoreFlowCapacityManagerService } from "./core-flow-capacity-manager.service";
import { CoreFlowDurableRuntimeService } from "./core-flow-durable-runtime.service";

@Injectable()
export class CoreFlowDistributedRuntimeService {
  constructor(
    private readonly leaderElection: CoreFlowLeaderElectionService,
    private readonly registry: CoreFlowClusterRegistryService,
    private readonly scheduler: CoreFlowDistributedSchedulerService,
    private readonly capacity: CoreFlowCapacityManagerService,
    private readonly durableRuntime: CoreFlowDurableRuntimeService,
  ) {}

  async coordinate(nodeId: string) {
    const leadership = await this.leaderElection.acquire(nodeId);
    const offline = await this.registry.markOfflineExpired();
    const recovered = await this.durableRuntime.recoverStaleLocks();
    const dispatched = leadership.acquired
      ? await this.scheduler.dispatchDue()
      : { dispatched: 0, skipped: "not-leader" };
    const capacity = await this.capacity.decide();

    return {
      nodeId,
      leadership,
      offline,
      recovered,
      dispatched,
      capacity,
      coordinatedAt: new Date().toISOString(),
    };
  }

  async dashboard() {
    return {
      leader: await this.leaderElection.current(),
      nodes: await this.registry.findAll(),
      capacity: await this.capacity.decide(),
      runtime: await this.durableRuntime.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
