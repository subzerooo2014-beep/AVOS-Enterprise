import { Injectable } from "@nestjs/common";
import { UNIFIED_OPERATIONS_CAPABILITIES } from "./unified-business-operations.registry";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";
import { EnterpriseAutomationService } from "./enterprise-automation.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { AiOperationsService } from "./ai-operations.service";

@Injectable()
export class UnifiedBusinessOperationsService {
  constructor(
    private readonly workflows: WorkflowOrchestratorService,
    private readonly automation: EnterpriseAutomationService,
    private readonly commandCenter: OperationsCommandCenterService,
    private readonly ai: AiOperationsService,
  ) {}

  capabilities() {
    return {
      system: "AVOS Unified Business Operations",
      capabilities: [...UNIFIED_OPERATIONS_CAPABILITIES],
      status: "READY",
    };
  }

  dashboard() {
    return {
      system: "AVOS Unified Business Operations",
      capabilities: UNIFIED_OPERATIONS_CAPABILITIES.length,
      workflows: this.workflows.dashboard(),
      automation: this.automation.dashboard(),
      commandCenter: this.commandCenter.dashboard(),
      aiOperations: this.ai.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}