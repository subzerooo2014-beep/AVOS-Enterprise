import { Module } from "@nestjs/common";
import { ApprovalGateService } from "./approval-gate.service";
import { CompensationEngineService } from "./compensation-engine.service";
import { EnterpriseWorkflowPlatformController } from "./enterprise-workflow-platform.controller";
import { EnterpriseWorkflowPlatformService } from "./enterprise-workflow-platform.service";
import { SagaCoordinatorService } from "./saga-coordinator.service";
import { WorkflowDefinitionRegistryService } from "./workflow-definition-registry.service";
import { WorkflowEventsService } from "./workflow-events.service";
import { WorkflowMetricsService } from "./workflow-metrics.service";
import { WorkflowReplayService } from "./workflow-replay.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";
import { WorkflowTimeoutManagerService } from "./workflow-timeout-manager.service";

@Module({
  controllers: [EnterpriseWorkflowPlatformController],
  providers: [
    ApprovalGateService,
    CompensationEngineService,
    EnterpriseWorkflowPlatformService,
    SagaCoordinatorService,
    WorkflowDefinitionRegistryService,
    WorkflowEventsService,
    WorkflowMetricsService,
    WorkflowReplayService,
    WorkflowStateStoreService,
    WorkflowTimeoutManagerService,
  ],
  exports: [
    ApprovalGateService,
    CompensationEngineService,
    EnterpriseWorkflowPlatformService,
    SagaCoordinatorService,
    WorkflowDefinitionRegistryService,
    WorkflowEventsService,
    WorkflowMetricsService,
    WorkflowReplayService,
    WorkflowStateStoreService,
    WorkflowTimeoutManagerService,
  ],
})
export class EnterpriseWorkflowPlatformModule {}
