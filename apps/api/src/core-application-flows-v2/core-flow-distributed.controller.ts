import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CoreFlowLeaderElectionService } from "./core-flow-leader-election.service";
import { CoreFlowClusterRegistryService } from "./core-flow-cluster-registry.service";
import { CoreFlowDistributedSchedulerService } from "./core-flow-distributed-scheduler.service";
import { CoreFlowCapacityManagerService } from "./core-flow-capacity-manager.service";
import { CoreFlowDistributedRuntimeService } from "./core-flow-distributed-runtime.service";

@Controller("core-flow-distributed")
export class CoreFlowDistributedController {
  constructor(
    private readonly leaderElection: CoreFlowLeaderElectionService,
    private readonly registry: CoreFlowClusterRegistryService,
    private readonly scheduler: CoreFlowDistributedSchedulerService,
    private readonly capacity: CoreFlowCapacityManagerService,
    private readonly runtime: CoreFlowDistributedRuntimeService,
  ) {}

  @Post("nodes")
  registerNode(@Body() dto: any) {
    return this.registry.register(dto);
  }

  @Get("nodes")
  nodes() {
    return this.registry.findAll();
  }

  @Post("nodes/:id/heartbeat")
  heartbeat(@Param("id") id: string, @Body() dto: any) {
    return this.registry.heartbeat(id, dto);
  }

  @Post("leader/:nodeId/acquire")
  acquireLeader(@Param("nodeId") nodeId: string, @Body() dto: any) {
    return this.leaderElection.acquire(nodeId, dto?.leaseMs);
  }

  @Get("leader")
  currentLeader() {
    return this.leaderElection.current();
  }

  @Post("schedules")
  schedule(@Body() dto: any) {
    return this.scheduler.schedule(dto);
  }

  @Post("schedules/dispatch-due")
  dispatchDue() {
    return this.scheduler.dispatchDue();
  }

  @Get("capacity")
  capacityDecision() {
    return this.capacity.decide();
  }

  @Post("coordinate/:nodeId")
  coordinate(@Param("nodeId") nodeId: string) {
    return this.runtime.coordinate(nodeId);
  }

  @Get("dashboard")
  dashboard() {
    return this.runtime.dashboard();
  }
}
