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
exports.RuntimeResilienceStatusService = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let RuntimeResilienceStatusService = class RuntimeResilienceStatusService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    snapshot() {
        const configurations = this.store.listConfigurations();
        const policies = this.store.listPolicies();
        const riskEvaluations = this.store.listRiskEvaluations();
        const signals = this.store.listSignals();
        const incidents = this.store.listIncidents();
        const actions = this.store.listActions();
        const baselines = this.store.listBaselines();
        const integrity = this.evidence.verify();
        const unhealthySignals = signals.filter((signal) => signal.status ===
            runtime_resilience_enums_1.RuntimeSignalStatus.UNHEALTHY).length;
        const degradedSignals = signals.filter((signal) => signal.status ===
            runtime_resilience_enums_1.RuntimeSignalStatus.DEGRADED).length;
        const openIncidents = incidents.filter((incident) => ![
            runtime_resilience_enums_1.RuntimeIncidentStatus.RESOLVED,
            runtime_resilience_enums_1.RuntimeIncidentStatus.CLOSED,
        ].includes(incident.status)).length;
        const failedActions = actions.filter((action) => action.status ===
            runtime_resilience_enums_1.ResilienceActionStatus.FAILED).length;
        const runningActions = actions.filter((action) => action.status ===
            runtime_resilience_enums_1.ResilienceActionStatus.RUNNING).length;
        const blockedEvaluations = riskEvaluations.filter((evaluation) => evaluation.decision ===
            runtime_resilience_enums_1.RuntimeDecision.BLOCK ||
            evaluation.decision ===
                runtime_resilience_enums_1.RuntimeDecision.EMERGENCY_ROLLBACK).length;
        let healthStatus = "healthy";
        if (!integrity.valid ||
            unhealthySignals > 0 ||
            failedActions > 0) {
            healthStatus = "unhealthy";
        }
        else if (degradedSignals > 0 ||
            openIncidents > 0 ||
            runningActions > 0) {
            healthStatus = "degraded";
        }
        return {
            generatedAt: new Date().toISOString(),
            system: "AVOS Production Hardening V8 — Mega Pack 3",
            version: "v8-mega-pack-3",
            healthStatus,
            evidenceChainVerified: integrity.valid,
            controlMode: this.store.getControlMode(),
            configurations: configurations.length,
            activeConfigurations: configurations.filter((configuration) => configuration.status ===
                runtime_resilience_enums_1.ResilienceConfigurationStatus.ACTIVE).length,
            pendingApprovals: configurations.filter((configuration) => configuration.status ===
                runtime_resilience_enums_1.ResilienceConfigurationStatus.PENDING_APPROVAL).length,
            policies: policies.length,
            activePolicies: policies.filter((policy) => policy.status ===
                runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE).length,
            riskEvaluations: riskEvaluations.length,
            blockedEvaluations,
            signals: signals.length,
            unhealthySignals,
            incidents: incidents.length,
            openIncidents,
            actions: actions.length,
            runningActions,
            failedActions,
            baselines: baselines.length,
            activeBaselines: baselines.filter((baseline) => baseline.active).length,
            evidenceEntries: this.store.listEvidenceEntries().length,
        };
    }
    health() {
        const snapshot = this.snapshot();
        return {
            success: snapshot.healthStatus !== "unhealthy" &&
                snapshot.evidenceChainVerified,
            system: snapshot.system,
            version: snapshot.version,
            healthStatus: snapshot.healthStatus,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            controlMode: snapshot.controlMode,
            generatedAt: snapshot.generatedAt,
        };
    }
};
exports.RuntimeResilienceStatusService = RuntimeResilienceStatusService;
exports.RuntimeResilienceStatusService = RuntimeResilienceStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], RuntimeResilienceStatusService);
//# sourceMappingURL=runtime-resilience-status.service.js.map