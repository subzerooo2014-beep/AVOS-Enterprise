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
exports.RuntimeBaselineService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_hash_util_1 = require("../utils/runtime-hash.util");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let RuntimeBaselineService = class RuntimeBaselineService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    capture(dto) {
        const configurationIds = dto.configurationIds ??
            this.store
                .listConfigurations()
                .filter((configuration) => configuration.environment === dto.environment &&
                configuration.namespace === dto.namespace &&
                configuration.status === "active")
                .map((configuration) => configuration.id);
        for (const configurationId of configurationIds) {
            if (!this.store.getConfiguration(configurationId)) {
                throw new common_1.NotFoundException(`Baseline configuration ${configurationId} was not found`);
            }
        }
        const signalSnapshot = dto.signalSnapshot ??
            this.buildSignalSnapshot(dto.environment, dto.namespace);
        const metadata = (dto.metadata ?? {});
        const capturedAt = new Date().toISOString();
        const snapshotHash = (0, runtime_hash_util_1.sha256Json)({
            key: dto.key,
            environment: dto.environment,
            namespace: dto.namespace,
            configurationIds,
            signalSnapshot,
            metadata,
            capturedAt,
        });
        const baseline = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            environment: dto.environment,
            namespace: dto.namespace,
            configurationIds,
            signalSnapshot,
            metadata,
            snapshotHash,
            capturedBy: dto.actor,
            capturedAt,
            active: true,
        };
        const saved = this.store.saveBaseline(baseline);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.BASELINE_CAPTURED,
            aggregateType: "runtime_baseline",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                baselineId: saved.id,
                key: saved.key,
                environment: saved.environment,
                namespace: saved.namespace,
                configurationIds: saved.configurationIds,
                snapshotHash: saved.snapshotHash,
                active: saved.active,
            },
        });
        return saved;
    }
    list() {
        return this.store.listBaselines();
    }
    get(id) {
        const baseline = this.store.getBaseline(id);
        if (!baseline) {
            throw new common_1.NotFoundException(`Runtime baseline ${id} was not found`);
        }
        return baseline;
    }
    verify(id) {
        const baseline = this.get(id);
        const calculatedHash = (0, runtime_hash_util_1.sha256Json)({
            key: baseline.key,
            environment: baseline.environment,
            namespace: baseline.namespace,
            configurationIds: baseline.configurationIds,
            signalSnapshot: baseline.signalSnapshot,
            metadata: baseline.metadata,
            capturedAt: baseline.capturedAt,
        });
        return {
            valid: calculatedHash === baseline.snapshotHash,
            baselineId: baseline.id,
            storedHash: baseline.snapshotHash,
            calculatedHash,
            verifiedAt: new Date().toISOString(),
        };
    }
    buildSignalSnapshot(environment, namespace) {
        const signals = this.store
            .listSignals()
            .filter((signal) => signal.environment === environment &&
            signal.namespace === namespace);
        const byStatus = signals.reduce((summary, signal) => {
            summary[signal.status] =
                (summary[signal.status] ?? 0) + 1;
            return summary;
        }, {});
        const byType = signals.reduce((summary, signal) => {
            summary[signal.type] =
                (summary[signal.type] ?? 0) + 1;
            return summary;
        }, {});
        return {
            total: signals.length,
            byStatus,
            byType,
            latestObservedAt: signals
                .slice()
                .sort((a, b) => b.observedAt.localeCompare(a.observedAt))[0]?.observedAt ?? null,
        };
    }
};
exports.RuntimeBaselineService = RuntimeBaselineService;
exports.RuntimeBaselineService = RuntimeBaselineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeBaselineService);
//# sourceMappingURL=runtime-baseline.service.js.map