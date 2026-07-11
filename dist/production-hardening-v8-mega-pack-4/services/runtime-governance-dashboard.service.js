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
exports.RuntimeGovernanceDashboardService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeGovernanceDashboardService = class RuntimeGovernanceDashboardService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    snapshot() {
        const requests = this.store
            .listGovernanceRequests();
        const windows = this.store
            .listChangeWindows();
        const maintenance = this.store
            .listMaintenanceModes();
        const nodes = this.store
            .listDependencyNodes();
        const edges = this.store
            .listDependencyEdges();
        const sloDefinitions = this.store
            .listSloDefinitions();
        const sloEvaluations = this.store
            .listSloEvaluations();
        const cascades = this.store
            .listCascadeAnalyses();
        const simulations = this.store
            .listSimulations();
        const integrity = this.audit.verify();
        const unhealthyDependencies = nodes.filter((node) => node.healthStatus ===
            contracts_1.DependencyHealthStatus.UNHEALTHY ||
            node.healthStatus ===
                contracts_1.DependencyHealthStatus.UNAVAILABLE).length;
        const breachedSlos = sloEvaluations.filter((item) => item.complianceStatus ===
            contracts_1.SloComplianceStatus.BREACHED).length;
        const healthStatus = !integrity.valid ||
            unhealthyDependencies > 0 ||
            breachedSlos > 0
            ? "unhealthy"
            : requests.some((request) => request.status ===
                contracts_1.GovernanceRequestStatus.EVALUATING ||
                request.status ===
                    contracts_1.GovernanceRequestStatus.DEFERRED) ||
                nodes.some((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.DEGRADED)
                ? "degraded"
                : "healthy";
        return {
            system: "AVOS Production Hardening V8 — Mega Pack 4",
            version: "v8-mega-pack-4",
            healthStatus,
            controlMode: this.store.getControlMode(),
            evidenceChainVerified: integrity.valid,
            requests: {
                total: requests.length,
                pending: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.PENDING).length,
                evaluating: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.EVALUATING).length,
                approved: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.APPROVED).length,
                rejected: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.REJECTED).length,
                deferred: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.DEFERRED).length,
                executed: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.EXECUTED).length,
                failed: requests.filter((item) => item.status ===
                    contracts_1.GovernanceRequestStatus.FAILED).length,
            },
            changeWindows: {
                total: windows.length,
                open: windows.filter((item) => item.status ===
                    contracts_1.ChangeWindowStatus.OPEN).length,
                scheduled: windows.filter((item) => item.status ===
                    contracts_1.ChangeWindowStatus.SCHEDULED).length,
                freeze: windows.filter((item) => item.type ===
                    contracts_1.ChangeWindowType.FREEZE).length,
                emergency: windows.filter((item) => item.type ===
                    contracts_1.ChangeWindowType.EMERGENCY).length,
            },
            maintenance: {
                total: maintenance.length,
                active: maintenance.filter((item) => item.status ===
                    contracts_1.MaintenanceModeStatus.ACTIVE).length,
                scheduled: maintenance.filter((item) => item.status ===
                    contracts_1.MaintenanceModeStatus.SCHEDULED).length,
            },
            dependencies: {
                nodes: nodes.length,
                edges: edges.length,
                healthy: nodes.filter((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.HEALTHY).length,
                degraded: nodes.filter((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.DEGRADED).length,
                unhealthy: nodes.filter((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.UNHEALTHY).length,
                unavailable: nodes.filter((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.UNAVAILABLE).length,
                unknown: nodes.filter((node) => node.healthStatus ===
                    contracts_1.DependencyHealthStatus.UNKNOWN).length,
            },
            slo: {
                definitions: sloDefinitions.length,
                enabledDefinitions: sloDefinitions.filter((item) => item.enabled).length,
                evaluations: sloEvaluations.length,
                compliant: sloEvaluations.filter((item) => item.complianceStatus ===
                    contracts_1.SloComplianceStatus.COMPLIANT).length,
                atRisk: sloEvaluations.filter((item) => item.complianceStatus ===
                    contracts_1.SloComplianceStatus.AT_RISK).length,
                breached: sloEvaluations.filter((item) => item.complianceStatus ===
                    contracts_1.SloComplianceStatus.BREACHED).length,
                unknown: sloEvaluations.filter((item) => item.complianceStatus ===
                    contracts_1.SloComplianceStatus.UNKNOWN).length,
            },
            cascade: {
                analyses: cascades.length,
                critical: cascades.filter((item) => item.risk ===
                    contracts_1.CascadingFailureRisk.CRITICAL).length,
                high: cascades.filter((item) => item.risk ===
                    contracts_1.CascadingFailureRisk.HIGH).length,
                medium: cascades.filter((item) => item.risk ===
                    contracts_1.CascadingFailureRisk.MEDIUM).length,
                low: cascades.filter((item) => item.risk ===
                    contracts_1.CascadingFailureRisk.LOW).length,
                none: cascades.filter((item) => item.risk ===
                    contracts_1.CascadingFailureRisk.NONE).length,
            },
            simulations: {
                total: simulations.length,
                completed: simulations.filter((item) => item.status ===
                    contracts_1.GovernanceSimulationStatus.COMPLETED).length,
                failed: simulations.filter((item) => item.status ===
                    contracts_1.GovernanceSimulationStatus.FAILED).length,
            },
            impactAnalyses: this.store
                .listImpactAnalyses()
                .length,
            approvalMatrixRules: this.store
                .listApprovalMatrixRules()
                .length,
            recommendations: this.store
                .listRecommendations()
                .length,
            auditEntries: this.store
                .listAuditEntries()
                .length,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeGovernanceDashboardService = RuntimeGovernanceDashboardService;
exports.RuntimeGovernanceDashboardService = RuntimeGovernanceDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeGovernanceDashboardService);
//# sourceMappingURL=runtime-governance-dashboard.service.js.map