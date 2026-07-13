import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { WorkflowsController } from "./workflows.controller";
import { WorkflowsService } from "./workflows.service";
import { CoreFlowOperationsController } from "../core-application-flows/core-flow-operations.controller";
import { CoreFlowAuditService } from "../core-application-flows/core-flow-audit.service";
import { CoreFlowOutboxService } from "../core-application-flows/core-flow-outbox.service";
import { CoreFlowPolicyService } from "../core-application-flows/core-flow-policy.service";
import { CoreFlowSnapshotService } from "../core-application-flows/core-flow-snapshot.service";
import { CoreFlowWorkerService } from "../core-application-flows/core-flow-worker.service";

@Module({
  imports: [EventsModule],
  controllers: [WorkflowsController, CoreFlowOperationsController],
  providers: [
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
  ],
  exports: [
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
  ],
})
export class WorkflowsModule {}
