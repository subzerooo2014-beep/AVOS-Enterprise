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
exports.ProductionHardeningV8MegaPack4StatusService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_execution_evidence_service_1 = require("./runtime-execution-evidence.service");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let ProductionHardeningV8MegaPack4StatusService = class ProductionHardeningV8MegaPack4StatusService {
    constructor(store, audit, executionEvidence) {
        this.store = store;
        this.audit = audit;
        this.executionEvidence = executionEvidence;
    }
    snapshot() {
        const auditIntegrity = this.audit.verify();
        const executionIntegrity = this.executionEvidence.verify();
        const requests = this.store.listGovernanceRequests();
        const windows = this.store.listChangeWindows();
        const maintenanceModes = this.store.listMaintenanceModes();
        const dependencyNodes = this.store.listDependencyNodes();
        const dependencyEdges = this.store.listDependencyEdges();
        const cascadeAnalyses = this.store.listCascadeAnalyses();
        const sloDefinitions = this.store.listSloDefinitions();
        const sloEvaluations = this.store.listSloEvaluations();
        const recommendations = this.store.listRecommendations();
        const simulations = this.store.listSimulations();
        const impactAnalyses = this.store.listImpactAnalyses();
        const approvalRules = this.store.listApprovalMatrixRules();
        const recoveryPlans = this.store.listRecoveryPlans();
        const isolationPlans = this.store.listIsolationPlans();
        const capacityPolicies = this.store.listCapacityPolicies();
        const capacityEvaluations = this.store.listCapacityEvaluations();
        const decisionRecords = this.store.listDecisionRecords();
        const approvalSuggestions = this.store.listApprovalSuggestions();
        const guardrails = this.store.listGuardrails();
        const guardrailEvaluations = this.store.listGuardrailEvaluations();
        const runbooks = this.store.listRunbookDefinitions();
        const runbookExecutions = this.store.listRunbookExecutions();
        const changeExecutions = this.store.listChangeExecutions();
        const executionLocks = this.store.listExecutionLocks();
        const schedules = this.store.listGovernanceSchedules();
        const scheduleRuns = this.store.listGovernanceScheduleRuns();
        const escalations = this.store.listGovernanceEscalations();
        const notifications = this.store.listGovernanceNotifications();
        const checkpoints = this.store.listGovernanceCheckpoints();
        const retentionPolicies = this.store.listGovernanceRetentionPolicies();
        const retentionEvaluations = this.store.listGovernanceRetentionEvaluations();
        const archives = this.store.listGovernanceArchives();
        const restorePlans = this.store.listGovernanceRestorePlans();
        const unhealthyDependencies = dependencyNodes.filter((item) => item.healthStatus ===
            contracts_1.DependencyHealthStatus.UNHEALTHY ||
            item.healthStatus ===
                contracts_1.DependencyHealthStatus.UNAVAILABLE).length;
        const breachedSlos = sloEvaluations.filter((item) => item.complianceStatus ===
            contracts_1.SloComplianceStatus.BREACHED).length;
        const criticalCapacityEvaluations = capacityEvaluations.filter((item) => item.status ===
            contracts_1.CapacityEvaluationStatus.CRITICAL).length;
        const failedExecutions = changeExecutions.filter((item) => item.status ===
            contracts_1.RuntimeChangeExecutionStatus.FAILED).length;
        const failedRunbooks = runbookExecutions.filter((item) => item.status ===
            contracts_1.RuntimeRunbookExecutionStatus.FAILED).length;
        const criticalEscalations = escalations.filter((item) => (item.severity ===
            contracts_1.GovernanceEscalationSeverity.CRITICAL ||
            item.severity ===
                contracts_1.GovernanceEscalationSeverity.EMERGENCY) &&
            (item.status ===
                contracts_1.GovernanceEscalationStatus.OPEN ||
                item.status ===
                    contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED ||
                item.status ===
                    contracts_1.GovernanceEscalationStatus.IN_PROGRESS)).length;
        const integrityHealthy = auditIntegrity.valid &&
            executionIntegrity.valid;
        const unhealthy = !integrityHealthy ||
            failedExecutions > 0 ||
            failedRunbooks > 0 ||
            criticalEscalations > 0;
        const degraded = unhealthyDependencies > 0 ||
            breachedSlos > 0 ||
            criticalCapacityEvaluations > 0 ||
            requests.some((item) => item.status ===
                contracts_1.GovernanceRequestStatus.DEFERRED ||
                item.status ===
                    contracts_1.GovernanceRequestStatus.EVALUATING);
        const healthStatus = unhealthy
            ? "unhealthy"
            : degraded
                ? "degraded"
                : "healthy";
        return {
            success: true,
            system: "AVOS Production Hardening V8 — Mega Pack 4",
            version: "v8-mega-pack-4",
            healthStatus,
            controlMode: this.store.getControlMode(),
            evidenceChainVerified: auditIntegrity.valid,
            executionEvidenceVerified: executionIntegrity.valid,
            governanceRequests: requests.length,
            pendingRequests: requests.filter((item) => item.status ===
                contracts_1.GovernanceRequestStatus.PENDING).length,
            approvedRequests: requests.filter((item) => item.status ===
                contracts_1.GovernanceRequestStatus.APPROVED).length,
            rejectedRequests: requests.filter((item) => item.status ===
                contracts_1.GovernanceRequestStatus.REJECTED).length,
            deferredRequests: requests.filter((item) => item.status ===
                contracts_1.GovernanceRequestStatus.DEFERRED).length,
            executedRequests: requests.filter((item) => item.status ===
                contracts_1.GovernanceRequestStatus.EXECUTED).length,
            changeWindows: windows.length,
            maintenanceModes: maintenanceModes.length,
            dependencyNodes: dependencyNodes.length,
            dependencyEdges: dependencyEdges.length,
            unhealthyDependencies,
            cascadeAnalyses: cascadeAnalyses.length,
            sloDefinitions: sloDefinitions.length,
            enabledSloDefinitions: sloDefinitions.filter((item) => item.enabled).length,
            sloEvaluations: sloEvaluations.length,
            breachedSlos,
            recommendations: recommendations.length,
            simulations: simulations.length,
            impactAnalyses: impactAnalyses.length,
            approvalMatrixRules: approvalRules.length,
            recoveryPlans: recoveryPlans.length,
            isolationPlans: isolationPlans.length,
            capacityPolicies: capacityPolicies.length,
            capacityEvaluations: capacityEvaluations.length,
            criticalCapacityEvaluations,
            decisionRecords: decisionRecords.length,
            pendingDecisionReviews: decisionRecords.filter((item) => item.status ===
                contracts_1.RuntimeDecisionRecordStatus.PENDING_REVIEW).length,
            approvalSuggestions: approvalSuggestions.length,
            guardrails: guardrails.length,
            guardrailEvaluations: guardrailEvaluations.length,
            failedGuardrails: guardrailEvaluations.filter((item) => item.result ===
                contracts_1.GuardrailEvaluationResult.FAILED).length,
            runbooks: runbooks.length,
            activeRunbooks: runbooks.filter((item) => item.status ===
                contracts_1.RuntimeRunbookStatus.ACTIVE).length,
            runbookExecutions: runbookExecutions.length,
            failedRunbookExecutions: failedRunbooks,
            changeExecutions: changeExecutions.length,
            activeChangeExecutions: changeExecutions.filter((item) => item.status ===
                contracts_1.RuntimeChangeExecutionStatus.EXECUTING ||
                item.status ===
                    contracts_1.RuntimeChangeExecutionStatus.VERIFYING ||
                item.status ===
                    contracts_1.RuntimeChangeExecutionStatus.VALIDATING).length,
            failedChangeExecutions: failedExecutions,
            executionLocks: executionLocks.length,
            activeExecutionLocks: executionLocks.filter((item) => item.status ===
                contracts_1.RuntimeLockStatus.ACTIVE).length,
            schedules: schedules.length,
            activeSchedules: schedules.filter((item) => item.status ===
                contracts_1.GovernanceScheduleStatus.ACTIVE).length,
            scheduleRuns: scheduleRuns.length,
            failedScheduleRuns: scheduleRuns.filter((item) => item.status ===
                contracts_1.GovernanceScheduleRunStatus.FAILED).length,
            escalations: escalations.length,
            openEscalations: escalations.filter((item) => item.status ===
                contracts_1.GovernanceEscalationStatus.OPEN ||
                item.status ===
                    contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED ||
                item.status ===
                    contracts_1.GovernanceEscalationStatus.IN_PROGRESS).length,
            criticalEscalations,
            notifications: notifications.length,
            pendingNotifications: notifications.filter((item) => item.status ===
                contracts_1.GovernanceNotificationStatus.PENDING ||
                item.status ===
                    contracts_1.GovernanceNotificationStatus.QUEUED).length,
            timelineEvents: this.store
                .listGovernanceTimeline()
                .length,
            checkpoints: checkpoints.length,
            verifiedCheckpoints: checkpoints.filter((item) => item.status ===
                contracts_1.GovernanceCheckpointStatus.VERIFIED ||
                item.status ===
                    contracts_1.GovernanceCheckpointStatus.RESTORE_READY).length,
            retentionPolicies: retentionPolicies.length,
            activeRetentionPolicies: retentionPolicies.filter((item) => item.status ===
                contracts_1.GovernanceRetentionStatus.ACTIVE).length,
            retentionEvaluations: retentionEvaluations.length,
            archives: archives.length,
            verifiedArchives: archives.filter((item) => item.status ===
                contracts_1.GovernanceArchiveStatus.VERIFIED).length,
            restorePlans: restorePlans.length,
            successfulRestorePlans: restorePlans.filter((item) => item.status ===
                contracts_1.GovernanceRestoreStatus.SUCCEEDED).length,
            auditEntries: this.store
                .listAuditEntries()
                .length,
            executionEvidenceEntries: this.store
                .listExecutionEvidence()
                .length,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.ProductionHardeningV8MegaPack4StatusService = ProductionHardeningV8MegaPack4StatusService;
exports.ProductionHardeningV8MegaPack4StatusService = ProductionHardeningV8MegaPack4StatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService,
        runtime_execution_evidence_service_1.RuntimeExecutionEvidenceService])
], ProductionHardeningV8MegaPack4StatusService);
//# sourceMappingURL=production-hardening-v8-mega-pack-4-status.service.js.map