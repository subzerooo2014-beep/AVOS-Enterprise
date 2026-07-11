import { Module } from "@nestjs/common";
import { ApprovalWorkflowController } from "./approval-workflow.controller";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { AutomatedRemediationController } from "./automated-remediation.controller";
import { AutomatedRemediationService } from "./automated-remediation.service";
import { ComplianceBaselineController } from "./compliance-baseline.controller";
import { ComplianceBaselineService } from "./compliance-baseline.service";
import { ControlSchedulerController } from "./control-scheduler.controller";
import { ControlSchedulerService } from "./control-scheduler.service";
import { EnterpriseFingerprintService } from "./enterprise-fingerprint.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { EvidenceChainController } from "./evidence-chain.controller";
import { EvidenceChainService } from "./evidence-chain.service";
import { IncidentCommandController } from "./incident-command.controller";
import { IncidentCommandService } from "./incident-command.service";
import { MegaPack6BootstrapService } from "./mega-pack-6-bootstrap.service";
import { MegaPack6Controller } from "./mega-pack-6.controller";
import { MegaPack6DashboardService } from "./mega-pack-6-dashboard.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { ObjectPathService } from "./object-path.service";
import { PlatformEventController } from "./platform-event.controller";
import { PlatformEventBusService } from "./platform-event-bus.service";
import { RiskTreatmentController } from "./risk-treatment.controller";
import { RiskTreatmentService } from "./risk-treatment.service";
import { WorkflowExecutionController } from "./workflow-execution.controller";
import { WorkflowExecutionService } from "./workflow-execution.service";

@Module({
  controllers: [
    MegaPack6Controller,
    ComplianceBaselineController,
    ApprovalWorkflowController,
    IncidentCommandController,
    RiskTreatmentController,
    WorkflowExecutionController,
    AutomatedRemediationController,
    EvidenceChainController,
    ControlSchedulerController,
    PlatformEventController,
  ],
  providers: [
    MegaPack6StorageService,
    EnterpriseSequenceService,
    EnterpriseFingerprintService,
    ObjectPathService,
    PlatformEventBusService,
    ComplianceBaselineService,
    ApprovalWorkflowService,
    IncidentCommandService,
    RiskTreatmentService,
    WorkflowExecutionService,
    EvidenceChainService,
    AutomatedRemediationService,
    ControlSchedulerService,
    MegaPack6BootstrapService,
    MegaPack6DashboardService,
  ],
  exports: [
    MegaPack6StorageService,
    PlatformEventBusService,
    ComplianceBaselineService,
    ApprovalWorkflowService,
    IncidentCommandService,
    RiskTreatmentService,
    WorkflowExecutionService,
    EvidenceChainService,
    AutomatedRemediationService,
    ControlSchedulerService,
    MegaPack6DashboardService,
  ],
})
export class ProductionHardeningV7MegaPack6Module {}
