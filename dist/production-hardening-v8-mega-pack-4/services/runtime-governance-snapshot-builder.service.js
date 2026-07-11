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
exports.RuntimeGovernanceSnapshotBuilderService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
let RuntimeGovernanceSnapshotBuilderService = class RuntimeGovernanceSnapshotBuilderService {
    constructor(store) {
        this.store = store;
    }
    build(scope) {
        const sections = [];
        const addSection = (key, value) => {
            const count = Array.isArray(value)
                ? value.length
                : 1;
            sections.push({
                key,
                count,
                checksum: (0, utils_1.governanceSha256Json)(value),
                data: value,
            });
        };
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.GOVERNANCE ||
            scope ===
                contracts_1.GovernanceSnapshotScope.REQUESTS) {
            addSection("governanceRequests", this.store
                .listGovernanceRequests());
            addSection("changeWindows", this.store
                .listChangeWindows());
            addSection("maintenanceModes", this.store
                .listMaintenanceModes());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.DECISIONS) {
            addSection("decisionRecords", this.store
                .listDecisionRecords());
            addSection("approvalSuggestions", this.store
                .listApprovalSuggestions());
            addSection("guardrails", this.store
                .listGuardrails());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.DEPENDENCIES) {
            addSection("dependencyNodes", this.store
                .listDependencyNodes());
            addSection("dependencyEdges", this.store
                .listDependencyEdges());
            addSection("cascadeAnalyses", this.store
                .listCascadeAnalyses());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.SLO) {
            addSection("sloDefinitions", this.store
                .listSloDefinitions());
            addSection("sloEvaluations", this.store
                .listSloEvaluations());
            addSection("capacityPolicies", this.store
                .listCapacityPolicies());
            addSection("capacityEvaluations", this.store
                .listCapacityEvaluations());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.EXECUTIONS) {
            addSection("runbooks", this.store
                .listRunbookDefinitions());
            addSection("runbookExecutions", this.store
                .listRunbookExecutions());
            addSection("changeExecutions", this.store
                .listChangeExecutions());
            addSection("recoveryPlans", this.store
                .listRecoveryPlans());
            addSection("isolationPlans", this.store
                .listIsolationPlans());
            addSection("executionLocks", this.store
                .listExecutionLocks());
            addSection("executionEvidence", this.store
                .listExecutionEvidence());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.OPERATIONS) {
            addSection("schedules", this.store
                .listGovernanceSchedules());
            addSection("scheduleRuns", this.store
                .listGovernanceScheduleRuns());
            addSection("escalations", this.store
                .listGovernanceEscalations());
            addSection("notifications", this.store
                .listGovernanceNotifications());
            addSection("timeline", this.store
                .listGovernanceTimeline());
        }
        if (scope ===
            contracts_1.GovernanceSnapshotScope.FULL ||
            scope ===
                contracts_1.GovernanceSnapshotScope.SECURITY) {
            addSection("auditEntries", this.store
                .listAuditEntries());
            addSection("controlMode", this.store
                .getControlMode());
        }
        return sections;
    }
    rootChecksum(sections) {
        return (0, utils_1.governanceSha256Json)(sections.map((section) => ({
            key: section.key,
            count: section.count,
            checksum: section.checksum,
        })));
    }
};
exports.RuntimeGovernanceSnapshotBuilderService = RuntimeGovernanceSnapshotBuilderService;
exports.RuntimeGovernanceSnapshotBuilderService = RuntimeGovernanceSnapshotBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceSnapshotBuilderService);
//# sourceMappingURL=runtime-governance-snapshot-builder.service.js.map