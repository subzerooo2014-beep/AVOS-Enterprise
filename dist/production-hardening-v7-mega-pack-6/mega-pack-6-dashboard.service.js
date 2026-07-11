"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaPack6DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const approval_workflow_service_1 = require("./approval-workflow.service");
const automated_remediation_service_1 = require("./automated-remediation.service");
const compliance_baseline_service_1 = require("./compliance-baseline.service");
const control_scheduler_service_1 = require("./control-scheduler.service");
const evidence_chain_service_1 = require("./evidence-chain.service");
const incident_command_service_1 = require("./incident-command.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
const risk_treatment_service_1 = require("./risk-treatment.service");
const workflow_execution_service_1 = require("./workflow-execution.service");
let MegaPack6DashboardService = class MegaPack6DashboardService {
    constructor(storage, baselines, approvals, incidents, treatments, workflows, remediations, evidence, scheduler, events) {
        this.storage = storage;
        this.baselines = baselines;
        this.approvals = approvals;
        this.incidents = incidents;
        this.treatments = treatments;
        this.workflows = workflows;
        this.remediations = remediations;
        this.evidence = evidence;
        this.scheduler = scheduler;
        this.events = events;
    }
    async status() {
        const [baselines, comparisons, approvals, incidentSummary, treatmentSummary, workflowDefinitions, workflowExecutions, remediations, evidenceEntries, evidenceVerification, schedules, schedulerRuns, platformEvents, pendingEvents,] = await Promise.all([
            this.baselines.list(),
            this.baselines.listComparisons(),
            this.approvals.list(),
            this.incidents.summary(),
            this.treatments.summary(),
            this.workflows.listDefinitions(),
            this.workflows.listExecutions(),
            this.remediations.list(),
            this.evidence.list(),
            this.evidence.verify(),
            this.scheduler.list(),
            this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.schedulerRuns),
            this.events.list(),
            this.events.pendingCount(),
        ]);
        const activeBaselines = baselines.filter((baseline) => baseline.status === "active").length;
        const driftComparisons = comparisons.filter((comparison) => comparison.status ===
            "drift_detected").length;
        const pendingApprovals = approvals.filter((approval) => approval.decision === "pending").length;
        const openRemediations = remediations.filter((remediation) => ![
            "completed",
            "cancelled",
        ].includes(remediation.status)).length;
        const failedWorkflows = workflowExecutions.filter((execution) => execution.status === "failed").length;
        const failedSchedulerRuns = schedulerRuns.filter((run) => run.status === "failed").length;
        return {
            success: true,
            system: mega_pack_6_constants_1.MEGA_PACK_6_SYSTEM.name,
            version: mega_pack_6_constants_1.MEGA_PACK_6_SYSTEM.version,
            module: mega_pack_6_constants_1.MEGA_PACK_6_SYSTEM.module,
            timestamp: new Date().toISOString(),
            capabilities: {
                complianceBaselineEngine: true,
                baselineDriftDetection: true,
                approvalWorkflowEngine: true,
                incidentCommandSystem: true,
                riskTreatmentWorkflows: true,
                workflowExecutionEngine: true,
                automatedRemediation: true,
                evidenceChainAutomation: true,
                controlScheduler: true,
                platformEventBus: true,
                persistentStorage: true,
            },
            health: {
                status: evidenceVerification.verified &&
                    failedWorkflows === 0 &&
                    failedSchedulerRuns === 0
                    ? "healthy"
                    : "warning",
                evidenceChainVerified: evidenceVerification.verified,
                pendingPlatformEvents: pendingEvents,
                failedWorkflows,
                failedSchedulerRuns,
            },
            metrics: {
                baselines: baselines.length,
                activeBaselines,
                baselineComparisons: comparisons.length,
                driftComparisons,
                approvals: approvals.length,
                pendingApprovals,
                incidents: incidentSummary,
                riskTreatments: treatmentSummary,
                workflowDefinitions: workflowDefinitions.length,
                workflowExecutions: workflowExecutions.length,
                automatedRemediations: remediations.length,
                openRemediations,
                evidenceEntries: evidenceEntries.length,
                evidenceVerification,
                schedules: schedules.length,
                schedulerRuns: schedulerRuns.length,
                platformEvents: platformEvents.length,
            },
        };
    }
};
exports.MegaPack6DashboardService = MegaPack6DashboardService;
exports.MegaPack6DashboardService = MegaPack6DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        compliance_baseline_service_1.ComplianceBaselineService,
        approval_workflow_service_1.ApprovalWorkflowService,
        incident_command_service_1.IncidentCommandService,
        risk_treatment_service_1.RiskTreatmentService,
        workflow_execution_service_1.WorkflowExecutionService,
        automated_remediation_service_1.AutomatedRemediationService,
        evidence_chain_service_1.EvidenceChainService,
        control_scheduler_service_1.ControlSchedulerService,
        platform_event_bus_service_1.PlatformEventBusService])
], MegaPack6DashboardService);
//# sourceMappingURL=mega-pack-6-dashboard.service.js.map