"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionHardeningV7MegaPack6Module = void 0;
const common_1 = require("@nestjs/common");
const approval_workflow_controller_1 = require("./approval-workflow.controller");
const approval_workflow_service_1 = require("./approval-workflow.service");
const automated_remediation_controller_1 = require("./automated-remediation.controller");
const automated_remediation_service_1 = require("./automated-remediation.service");
const compliance_baseline_controller_1 = require("./compliance-baseline.controller");
const compliance_baseline_service_1 = require("./compliance-baseline.service");
const control_scheduler_controller_1 = require("./control-scheduler.controller");
const control_scheduler_service_1 = require("./control-scheduler.service");
const enterprise_fingerprint_service_1 = require("./enterprise-fingerprint.service");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const evidence_chain_controller_1 = require("./evidence-chain.controller");
const evidence_chain_service_1 = require("./evidence-chain.service");
const incident_command_controller_1 = require("./incident-command.controller");
const incident_command_service_1 = require("./incident-command.service");
const mega_pack_6_bootstrap_service_1 = require("./mega-pack-6-bootstrap.service");
const mega_pack_6_controller_1 = require("./mega-pack-6.controller");
const mega_pack_6_dashboard_service_1 = require("./mega-pack-6-dashboard.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const object_path_service_1 = require("./object-path.service");
const platform_event_controller_1 = require("./platform-event.controller");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
const risk_treatment_controller_1 = require("./risk-treatment.controller");
const risk_treatment_service_1 = require("./risk-treatment.service");
const workflow_execution_controller_1 = require("./workflow-execution.controller");
const workflow_execution_service_1 = require("./workflow-execution.service");
let ProductionHardeningV7MegaPack6Module = class ProductionHardeningV7MegaPack6Module {
};
exports.ProductionHardeningV7MegaPack6Module = ProductionHardeningV7MegaPack6Module;
exports.ProductionHardeningV7MegaPack6Module = ProductionHardeningV7MegaPack6Module = __decorate([
    (0, common_1.Module)({
        controllers: [
            mega_pack_6_controller_1.MegaPack6Controller,
            compliance_baseline_controller_1.ComplianceBaselineController,
            approval_workflow_controller_1.ApprovalWorkflowController,
            incident_command_controller_1.IncidentCommandController,
            risk_treatment_controller_1.RiskTreatmentController,
            workflow_execution_controller_1.WorkflowExecutionController,
            automated_remediation_controller_1.AutomatedRemediationController,
            evidence_chain_controller_1.EvidenceChainController,
            control_scheduler_controller_1.ControlSchedulerController,
            platform_event_controller_1.PlatformEventController,
        ],
        providers: [
            mega_pack_6_storage_service_1.MegaPack6StorageService,
            enterprise_sequence_service_1.EnterpriseSequenceService,
            enterprise_fingerprint_service_1.EnterpriseFingerprintService,
            object_path_service_1.ObjectPathService,
            platform_event_bus_service_1.PlatformEventBusService,
            compliance_baseline_service_1.ComplianceBaselineService,
            approval_workflow_service_1.ApprovalWorkflowService,
            incident_command_service_1.IncidentCommandService,
            risk_treatment_service_1.RiskTreatmentService,
            workflow_execution_service_1.WorkflowExecutionService,
            evidence_chain_service_1.EvidenceChainService,
            automated_remediation_service_1.AutomatedRemediationService,
            control_scheduler_service_1.ControlSchedulerService,
            mega_pack_6_bootstrap_service_1.MegaPack6BootstrapService,
            mega_pack_6_dashboard_service_1.MegaPack6DashboardService,
        ],
        exports: [
            mega_pack_6_storage_service_1.MegaPack6StorageService,
            platform_event_bus_service_1.PlatformEventBusService,
            compliance_baseline_service_1.ComplianceBaselineService,
            approval_workflow_service_1.ApprovalWorkflowService,
            incident_command_service_1.IncidentCommandService,
            risk_treatment_service_1.RiskTreatmentService,
            workflow_execution_service_1.WorkflowExecutionService,
            evidence_chain_service_1.EvidenceChainService,
            automated_remediation_service_1.AutomatedRemediationService,
            control_scheduler_service_1.ControlSchedulerService,
            mega_pack_6_dashboard_service_1.MegaPack6DashboardService,
        ],
    })
], ProductionHardeningV7MegaPack6Module);
//# sourceMappingURL=production-hardening-v7-mega-pack-6.module.js.map