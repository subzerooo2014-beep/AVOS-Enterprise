import { Module } from "@nestjs/common";
import { UnifiedBusinessOperationsController } from "./unified-business-operations.controller";
import { UnifiedBusinessOperationsService } from "./unified-business-operations.service";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";
import { EnterpriseAutomationService } from "./enterprise-automation.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { AiOperationsService } from "./ai-operations.service";

@Module({
  controllers: [UnifiedBusinessOperationsController],
  providers: [
    UnifiedBusinessOperationsService,
    WorkflowOrchestratorService,
    EnterpriseAutomationService,
    OperationsCommandCenterService,
    AiOperationsService,
  ],
  exports: [
    UnifiedBusinessOperationsService,
    WorkflowOrchestratorService,
    EnterpriseAutomationService,
    OperationsCommandCenterService,
    AiOperationsService,
  ],
})
export class UnifiedBusinessOperationsModule {}