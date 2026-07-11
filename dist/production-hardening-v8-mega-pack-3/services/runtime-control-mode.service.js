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
exports.RuntimeControlModeService = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
let RuntimeControlModeService = class RuntimeControlModeService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
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
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.CONTROL_MODE_CHANGED,
            aggregateType: "runtime_control_plane",
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
exports.RuntimeControlModeService = RuntimeControlModeService;
exports.RuntimeControlModeService = RuntimeControlModeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeControlModeService);
//# sourceMappingURL=runtime-control-mode.service.js.map