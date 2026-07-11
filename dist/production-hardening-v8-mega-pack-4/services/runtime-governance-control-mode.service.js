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
exports.RuntimeGovernanceControlModeService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeGovernanceControlModeService = class RuntimeGovernanceControlModeService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    get() {
        return {
            controlMode: this.store.getControlMode(),
            observedAt: new Date().toISOString(),
        };
    }
    change(dto) {
        const previousControlMode = this.store.getControlMode();
        this.store.setControlMode(dto.controlMode);
        const changedAt = new Date().toISOString();
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .CONTROL_MODE_CHANGED,
            aggregateType: "runtime_governance",
            aggregateId: "global",
            actor: dto.actor,
            payload: {
                previousControlMode,
                controlMode: dto.controlMode,
                reason: dto.reason,
                changedAt,
            },
        });
        return {
            previousControlMode,
            controlMode: dto.controlMode,
            changedAt,
        };
    }
};
exports.RuntimeGovernanceControlModeService = RuntimeGovernanceControlModeService;
exports.RuntimeGovernanceControlModeService = RuntimeGovernanceControlModeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeGovernanceControlModeService);
//# sourceMappingURL=runtime-governance-control-mode.service.js.map