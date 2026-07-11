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
exports.RuntimeGovernanceDataLifecycleStatusService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeGovernanceDataLifecycleStatusService = class RuntimeGovernanceDataLifecycleStatusService {
    constructor(store) {
        this.store = store;
    }
    snapshot() {
        const checkpoints = this.store
            .listGovernanceCheckpoints();
        const policies = this.store
            .listGovernanceRetentionPolicies();
        const archives = this.store
            .listGovernanceArchives();
        const restores = this.store
            .listGovernanceRestorePlans();
        return {
            checkpoints: checkpoints.length,
            verifiedCheckpoints: checkpoints.filter((item) => item.status ===
                contracts_1.GovernanceCheckpointStatus.VERIFIED).length,
            invalidCheckpoints: checkpoints.filter((item) => item.status ===
                contracts_1.GovernanceCheckpointStatus.INVALID).length,
            restoreReadyCheckpoints: checkpoints.filter((item) => item.status ===
                contracts_1.GovernanceCheckpointStatus.RESTORE_READY).length,
            retentionPolicies: policies.length,
            activeRetentionPolicies: policies.filter((item) => item.status ===
                contracts_1.GovernanceRetentionStatus.ACTIVE).length,
            retentionEvaluations: this.store
                .listGovernanceRetentionEvaluations()
                .length,
            archives: archives.length,
            readyArchives: archives.filter((item) => item.status ===
                contracts_1.GovernanceArchiveStatus.READY).length,
            verifiedArchives: archives.filter((item) => item.status ===
                contracts_1.GovernanceArchiveStatus.VERIFIED).length,
            failedArchives: archives.filter((item) => item.status ===
                contracts_1.GovernanceArchiveStatus.FAILED).length,
            restorePlans: restores.length,
            readyRestorePlans: restores.filter((item) => item.status ===
                contracts_1.GovernanceRestoreStatus.READY).length,
            successfulRestorePlans: restores.filter((item) => item.status ===
                contracts_1.GovernanceRestoreStatus.SUCCEEDED).length,
            failedRestorePlans: restores.filter((item) => item.status ===
                contracts_1.GovernanceRestoreStatus.FAILED).length,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeGovernanceDataLifecycleStatusService = RuntimeGovernanceDataLifecycleStatusService;
exports.RuntimeGovernanceDataLifecycleStatusService = RuntimeGovernanceDataLifecycleStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceDataLifecycleStatusService);
//# sourceMappingURL=runtime-governance-data-lifecycle-status.service.js.map