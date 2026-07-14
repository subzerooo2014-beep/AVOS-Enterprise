import { Module } from "@nestjs/common";
import { EnterpriseAnomalyDetectionService } from "./enterprise-anomaly-detection.service";
import { EnterpriseAutoRemediationService } from "./enterprise-auto-remediation.service";
import { EnterpriseAutonomousOperationsService } from "./enterprise-autonomous-operations.service";
import { EnterpriseE6Controller } from "./enterprise-e6.controller";
import { EnterpriseE6OrchestratorService } from "./enterprise-e6-orchestrator.service";
import { EnterpriseFailoverCoordinatorService } from "./enterprise-failover-coordinator.service";
import { EnterpriseRemediationPlannerService } from "./enterprise-remediation-planner.service";
import { EnterpriseResilienceAutomationService } from "./enterprise-resilience-automation.service";
import { EnterpriseSelfHealingService } from "./enterprise-self-healing.service";

@Module({
  controllers: [EnterpriseE6Controller],
  providers: [
    EnterpriseAnomalyDetectionService,
    EnterpriseRemediationPlannerService,
    EnterpriseSelfHealingService,
    EnterpriseAutoRemediationService,
    EnterpriseFailoverCoordinatorService,
    EnterpriseResilienceAutomationService,
    EnterpriseAutonomousOperationsService,
    EnterpriseE6OrchestratorService,
  ],
  exports: [
    EnterpriseAnomalyDetectionService,
    EnterpriseRemediationPlannerService,
    EnterpriseSelfHealingService,
    EnterpriseAutoRemediationService,
    EnterpriseFailoverCoordinatorService,
    EnterpriseResilienceAutomationService,
    EnterpriseAutonomousOperationsService,
    EnterpriseE6OrchestratorService,
  ],
})
export class EnterpriseE6Module {}