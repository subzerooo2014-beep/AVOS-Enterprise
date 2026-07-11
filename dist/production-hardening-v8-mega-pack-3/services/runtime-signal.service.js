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
exports.RuntimeSignalService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let RuntimeSignalService = class RuntimeSignalService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    record(dto) {
        const receivedAt = new Date().toISOString();
        const signal = {
            id: (0, crypto_1.randomUUID)(),
            source: dto.source,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            type: dto.type,
            status: dto.status,
            value: dto.value,
            unit: dto.unit,
            thresholdWarning: dto.thresholdWarning,
            thresholdCritical: dto.thresholdCritical,
            message: dto.message,
            labels: dto.labels ?? {},
            metadata: (dto.metadata ?? {}),
            observedAt: dto.observedAt ?? receivedAt,
            receivedAt,
        };
        const saved = this.store.saveSignal(signal);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.SIGNAL_RECORDED,
            aggregateType: "runtime_signal",
            aggregateId: saved.id,
            actor: {
                id: dto.source,
                type: "service",
                name: dto.source,
            },
            payload: {
                signalId: saved.id,
                environment: saved.environment,
                namespace: saved.namespace,
                service: saved.service,
                type: saved.type,
                status: saved.status,
                value: saved.value,
                unit: saved.unit ?? null,
                observedAt: saved.observedAt,
            },
        });
        return saved;
    }
    list(filters) {
        return this.store.listSignals().filter((signal) => {
            if (filters?.environment &&
                signal.environment !== filters.environment) {
                return false;
            }
            if (filters?.namespace &&
                signal.namespace !== filters.namespace) {
                return false;
            }
            if (filters?.service &&
                signal.service !== filters.service) {
                return false;
            }
            if (filters?.status &&
                signal.status !== filters.status) {
                return false;
            }
            return true;
        });
    }
    get(id) {
        const signal = this.store.getSignal(id);
        if (!signal) {
            throw new common_1.NotFoundException(`Runtime signal ${id} was not found`);
        }
        return signal;
    }
    summarize(filters) {
        const signals = this.list(filters);
        return {
            total: signals.length,
            healthy: signals.filter((signal) => signal.status === runtime_resilience_enums_1.RuntimeSignalStatus.HEALTHY).length,
            degraded: signals.filter((signal) => signal.status === runtime_resilience_enums_1.RuntimeSignalStatus.DEGRADED).length,
            unhealthy: signals.filter((signal) => signal.status === runtime_resilience_enums_1.RuntimeSignalStatus.UNHEALTHY).length,
            unknown: signals.filter((signal) => signal.status === runtime_resilience_enums_1.RuntimeSignalStatus.UNKNOWN).length,
            latestObservedAt: signals
                .slice()
                .sort((a, b) => b.observedAt.localeCompare(a.observedAt))[0]?.observedAt,
        };
    }
};
exports.RuntimeSignalService = RuntimeSignalService;
exports.RuntimeSignalService = RuntimeSignalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeSignalService);
//# sourceMappingURL=runtime-signal.service.js.map