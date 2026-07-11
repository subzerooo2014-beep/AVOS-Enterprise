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
exports.RuntimeResilienceVerificationService = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("../services/runtime-evidence-chain.service");
const runtime_resilience_status_service_1 = require("../services/runtime-resilience-status.service");
let RuntimeResilienceVerificationService = class RuntimeResilienceVerificationService {
    constructor(store, evidence, status) {
        this.store = store;
        this.evidence = evidence;
        this.status = status;
    }
    verify() {
        const snapshot = this.status.snapshot();
        const integrity = this.evidence.verify();
        const configurations = this.store.listConfigurations();
        const policies = this.store.listPolicies();
        const signals = this.store.listSignals();
        const baselines = this.store.listBaselines();
        const checks = [
            this.check("evidence_chain_integrity", true, integrity.valid),
            this.check("control_mode_available", true, Boolean(snapshot.controlMode)),
            this.check("configuration_exists", true, configurations.length > 0),
            this.check("active_configuration_exists", true, configurations.some((configuration) => configuration.status ===
                runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE)),
            this.check("policy_exists", true, policies.length > 0),
            this.check("active_policy_exists", true, policies.some((policy) => policy.status ===
                runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE)),
            this.check("risk_evaluation_exists", true, snapshot.riskEvaluations > 0),
            this.check("healthy_signal_exists", true, signals.some((signal) => signal.status ===
                runtime_resilience_enums_1.RuntimeSignalStatus.HEALTHY)),
            this.check("active_baseline_exists", true, baselines.some((baseline) => baseline.active)),
            this.check("evidence_entries_exist", true, snapshot.evidenceEntries > 0),
            this.check("no_failed_actions", 0, snapshot.failedActions),
            this.check("no_unhealthy_signals", 0, snapshot.unhealthySignals),
            this.check("health_not_unhealthy", true, snapshot.healthStatus !== "unhealthy"),
        ];
        const checksFailed = checks.filter((check) => !check.success).length;
        return {
            success: checksFailed === 0 &&
                integrity.valid &&
                snapshot.healthStatus !== "unhealthy",
            system: "AVOS Production Hardening V8 — Mega Pack 3",
            version: "v8-mega-pack-3",
            healthStatus: snapshot.healthStatus,
            evidenceChainVerified: integrity.valid,
            checksPassed: checks.length - checksFailed,
            checksFailed,
            checks,
            snapshot,
            verifiedAt: new Date().toISOString(),
        };
    }
    check(name, expected, actual) {
        return {
            name,
            success: expected === actual,
            expected,
            actual,
        };
    }
};
exports.RuntimeResilienceVerificationService = RuntimeResilienceVerificationService;
exports.RuntimeResilienceVerificationService = RuntimeResilienceVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService,
        runtime_resilience_status_service_1.RuntimeResilienceStatusService])
], RuntimeResilienceVerificationService);
//# sourceMappingURL=runtime-resilience-verification.service.js.map