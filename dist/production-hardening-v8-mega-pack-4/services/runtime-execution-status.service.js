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
exports.RuntimeExecutionStatusService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_execution_evidence_service_1 = require("./runtime-execution-evidence.service");
let RuntimeExecutionStatusService = class RuntimeExecutionStatusService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    snapshot() {
        const runbooks = this.store
            .listRunbookDefinitions();
        const runbookExecutions = this.store
            .listRunbookExecutions();
        const changeExecutions = this.store
            .listChangeExecutions();
        const locks = this.store
            .listExecutionLocks();
        const integrity = this.evidence.verify();
        return {
            runbooks: runbooks.length,
            activeRunbooks: runbooks.filter((item) => item.status ===
                contracts_1.RuntimeRunbookStatus.ACTIVE).length,
            runbookExecutions: runbookExecutions.length,
            runningRunbookExecutions: runbookExecutions.filter((item) => item.status ===
                contracts_1.RuntimeRunbookExecutionStatus.RUNNING).length,
            failedRunbookExecutions: runbookExecutions.filter((item) => item.status ===
                contracts_1.RuntimeRunbookExecutionStatus.FAILED).length,
            changeExecutions: changeExecutions.length,
            activeChangeExecutions: changeExecutions.filter((item) => [
                contracts_1.RuntimeChangeExecutionStatus.VALIDATING,
                contracts_1.RuntimeChangeExecutionStatus.EXECUTING,
                contracts_1.RuntimeChangeExecutionStatus.VERIFYING,
            ].includes(item.status)).length,
            blockedChangeExecutions: changeExecutions.filter((item) => item.status ===
                contracts_1.RuntimeChangeExecutionStatus.BLOCKED).length,
            failedChangeExecutions: changeExecutions.filter((item) => item.status ===
                contracts_1.RuntimeChangeExecutionStatus.FAILED).length,
            activeLocks: locks.filter((item) => item.status ===
                contracts_1.RuntimeLockStatus.ACTIVE).length,
            expiredLocks: locks.filter((item) => item.status ===
                contracts_1.RuntimeLockStatus.EXPIRED).length,
            executionEvidenceEntries: this.store
                .listExecutionEvidence()
                .length,
            evidenceChainVerified: integrity.valid,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeExecutionStatusService = RuntimeExecutionStatusService;
exports.RuntimeExecutionStatusService = RuntimeExecutionStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_execution_evidence_service_1.RuntimeExecutionEvidenceService])
], RuntimeExecutionStatusService);
//# sourceMappingURL=runtime-execution-status.service.js.map