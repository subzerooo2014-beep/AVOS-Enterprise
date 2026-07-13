import { Injectable } from "@nestjs/common";

import { RuntimeCoordinator } from "./engines/runtime-coordinator";
import { DistributedTaskScheduler } from "./engines/distributed-task-scheduler";
import { NodeCoordinator } from "./engines/node-coordinator";
import { RuntimeHealthService } from "./engines/runtime-health.service";

@Injectable()
export class EnterpriseRuntimeService {
  constructor(
    private readonly coordinator: RuntimeCoordinator,
    private readonly scheduler: DistributedTaskScheduler,
    private readonly nodeCoordinator: NodeCoordinator,
    private readonly healthService: RuntimeHealthService,
  ) {}

  coordinate() {
    return this.coordinator.coordinate();
  }

  schedule(task: Record<string, any>) {
    return this.scheduler.schedule(task);
  }

  cluster() {
    return this.nodeCoordinator.nodes();
  }

  health() {
    return this.healthService.health();
  }

  status() {
    return {
      system: "AVOS Enterprise Runtime",
      version: "E1.2",
      status: "running",
      coordinator: this.coordinate(),
      cluster: this.cluster(),
      health: this.health(),
    };
  }
}
