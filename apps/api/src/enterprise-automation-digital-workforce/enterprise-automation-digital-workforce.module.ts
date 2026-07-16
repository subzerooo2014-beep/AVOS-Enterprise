import { Module } from "@nestjs/common";
import { AutomationAnalyticsService } from "./automation-analytics.service";
import { AutomationApprovalService } from "./automation-approval.service";
import { AutomationJobOrchestratorService } from "./automation-job-orchestrator.service";
import { AutomationRegistryService } from "./automation-registry.service";
import { DigitalWorkerRegistryService } from "./digital-worker-registry.service";
import { EnterpriseAutomationDigitalWorkforceController } from "./enterprise-automation-digital-workforce.controller";

@Module({
  controllers: [EnterpriseAutomationDigitalWorkforceController],
  providers: [
    AutomationAnalyticsService,
    AutomationApprovalService,
    AutomationJobOrchestratorService,
    AutomationRegistryService,
    DigitalWorkerRegistryService,
  ],
  exports: [
    AutomationAnalyticsService,
    AutomationApprovalService,
    AutomationJobOrchestratorService,
    AutomationRegistryService,
    DigitalWorkerRegistryService,
  ],
})
export class EnterpriseAutomationDigitalWorkforceModule {}
