import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { WorkflowsController } from "./workflows.controller";
import { WorkflowsService } from "./workflows.service";
import { CoreFlowOperationsController } from "../core-application-flows/core-flow-operations.controller";
import { CoreFlowResilienceController } from "../core-application-flows/core-flow-resilience.controller";
import { CoreFlowProcessManagerController } from "../core-application-flows/core-flow-process-manager.controller";
import { CoreFlowAuditService } from "../core-application-flows/core-flow-audit.service";
import { CoreFlowOutboxService } from "../core-application-flows/core-flow-outbox.service";
import { CoreFlowPolicyService } from "../core-application-flows/core-flow-policy.service";
import { CoreFlowSnapshotService } from "../core-application-flows/core-flow-snapshot.service";
import { CoreFlowWorkerService } from "../core-application-flows/core-flow-worker.service";
import { CoreFlowSagaService } from "../core-application-flows/core-flow-saga.service";
import { CoreFlowSchedulerService } from "../core-application-flows/core-flow-scheduler.service";
import { CoreFlowRateLimitService } from "../core-application-flows/core-flow-rate-limit.service";
import { CoreFlowCircuitBreakerService } from "../core-application-flows/core-flow-circuit-breaker.service";
import { CoreFlowObservabilityService } from "../core-application-flows/core-flow-observability.service";
import { CoreFlowRulesService } from "../core-application-flows/core-flow-rules.service";
import { CoreFlowApprovalService } from "../core-application-flows/core-flow-approval.service";
import { CoreFlowTimeoutService } from "../core-application-flows/core-flow-timeout.service";
import { CoreFlowProcessManagerService } from "../core-application-flows/core-flow-process-manager.service";

@Module({
  imports: [EventsModule],
  controllers: [
    WorkflowsController,
    CoreFlowOperationsController,
    CoreFlowResilienceController,
    CoreFlowProcessManagerController,
  ],
  providers: [
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
    CoreFlowSagaService,
    CoreFlowSchedulerService,
    CoreFlowRateLimitService,
    CoreFlowCircuitBreakerService,
    CoreFlowObservabilityService,
    CoreFlowRulesService,
    CoreFlowApprovalService,
    CoreFlowTimeoutService,
    CoreFlowProcessManagerService,
  ],
  exports: [
    WorkflowsService,
    CoreFlowAuditService,
    CoreFlowOutboxService,
    CoreFlowPolicyService,
    CoreFlowSnapshotService,
    CoreFlowWorkerService,
    CoreFlowSagaService,
    CoreFlowSchedulerService,
    CoreFlowRateLimitService,
    CoreFlowCircuitBreakerService,
    CoreFlowObservabilityService,
    CoreFlowRulesService,
    CoreFlowApprovalService,
    CoreFlowTimeoutService,
    CoreFlowProcessManagerService,
  ],
})
export class WorkflowsModule {}
