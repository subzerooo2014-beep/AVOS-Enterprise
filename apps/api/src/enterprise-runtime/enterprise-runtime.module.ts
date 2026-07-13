import { Module } from "@nestjs/common";
import { EnterpriseRuntimeController } from "./enterprise-runtime.controller";
import { EnterpriseRuntimeService } from "./enterprise-runtime.service";
import { RuntimeCoordinator } from "./engines/runtime-coordinator";
import { DistributedTaskScheduler } from "./engines/distributed-task-scheduler";
import { NodeCoordinator } from "./engines/node-coordinator";
import { RuntimeHealthService } from "./engines/runtime-health.service";

@Module({
  controllers: [EnterpriseRuntimeController],
  providers: [
    EnterpriseRuntimeService,
    RuntimeCoordinator,
    DistributedTaskScheduler,
    NodeCoordinator,
    RuntimeHealthService,
  ],
  exports: [
    EnterpriseRuntimeService,
    RuntimeCoordinator,
    DistributedTaskScheduler,
    NodeCoordinator,
    RuntimeHealthService,
  ],
})
export class EnterpriseRuntimeModule {}
