"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeResilienceStore = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const canonical_json_util_1 = require("../utils/canonical-json.util");
let RuntimeResilienceStore = class RuntimeResilienceStore {
    constructor() {
        this.configurations = new Map();
        this.policies = new Map();
        this.riskEvaluations = new Map();
        this.signals = new Map();
        this.incidents = new Map();
        this.actions = new Map();
        this.baselines = new Map();
        this.evidenceEntries = [];
        this.controlMode = runtime_resilience_enums_1.RuntimeControlMode.ENFORCE;
    }
    getControlMode() {
        return this.controlMode;
    }
    setControlMode(controlMode) {
        this.controlMode = controlMode;
    }
    saveConfiguration(configuration) {
        const stored = (0, canonical_json_util_1.cloneJson)(configuration);
        this.configurations.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getConfiguration(id) {
        const item = this.configurations.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listConfigurations() {
        return Array.from(this.configurations.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    findConfigurationsByKey(key) {
        return this.listConfigurations()
            .filter((item) => item.key === key)
            .sort((a, b) => b.version - a.version);
    }
    savePolicy(policy) {
        const stored = (0, canonical_json_util_1.cloneJson)(policy);
        this.policies.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getPolicy(id) {
        const item = this.policies.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listPolicies() {
        return Array.from(this.policies.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    findPoliciesByKey(key) {
        return this.listPolicies()
            .filter((item) => item.key === key)
            .sort((a, b) => b.version - a.version);
    }
    saveRiskEvaluation(evaluation) {
        const stored = (0, canonical_json_util_1.cloneJson)(evaluation);
        this.riskEvaluations.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getRiskEvaluation(id) {
        const item = this.riskEvaluations.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listRiskEvaluations() {
        return Array.from(this.riskEvaluations.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.evaluatedAt.localeCompare(a.evaluatedAt));
    }
    saveSignal(signal) {
        const stored = (0, canonical_json_util_1.cloneJson)(signal);
        this.signals.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getSignal(id) {
        const item = this.signals.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listSignals() {
        return Array.from(this.signals.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.observedAt.localeCompare(a.observedAt));
    }
    saveIncident(incident) {
        const stored = (0, canonical_json_util_1.cloneJson)(incident);
        this.incidents.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getIncident(id) {
        const item = this.incidents.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listIncidents() {
        return Array.from(this.incidents.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    saveAction(action) {
        const stored = (0, canonical_json_util_1.cloneJson)(action);
        this.actions.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getAction(id) {
        const item = this.actions.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listActions() {
        return Array.from(this.actions.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
    }
    saveBaseline(baseline) {
        const stored = (0, canonical_json_util_1.cloneJson)(baseline);
        if (stored.active) {
            for (const existing of this.baselines.values()) {
                if (existing.environment === stored.environment &&
                    existing.namespace === stored.namespace &&
                    existing.active) {
                    existing.active = false;
                    this.baselines.set(existing.id, existing);
                }
            }
        }
        this.baselines.set(stored.id, stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    getBaseline(id) {
        const item = this.baselines.get(id);
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    listBaselines() {
        return Array.from(this.baselines.values())
            .map((item) => (0, canonical_json_util_1.cloneJson)(item))
            .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
    }
    appendEvidence(entry) {
        const stored = (0, canonical_json_util_1.cloneJson)(entry);
        this.evidenceEntries.push(stored);
        return (0, canonical_json_util_1.cloneJson)(stored);
    }
    listEvidenceEntries() {
        return this.evidenceEntries.map((item) => (0, canonical_json_util_1.cloneJson)(item));
    }
    getLatestEvidenceEntry() {
        const item = this.evidenceEntries.length > 0
            ? this.evidenceEntries[this.evidenceEntries.length - 1]
            : undefined;
        return item ? (0, canonical_json_util_1.cloneJson)(item) : undefined;
    }
    clear() {
        this.configurations.clear();
        this.policies.clear();
        this.riskEvaluations.clear();
        this.signals.clear();
        this.incidents.clear();
        this.actions.clear();
        this.baselines.clear();
        this.evidenceEntries.splice(0, this.evidenceEntries.length);
        this.controlMode = runtime_resilience_enums_1.RuntimeControlMode.ENFORCE;
    }
};
exports.RuntimeResilienceStore = RuntimeResilienceStore;
exports.RuntimeResilienceStore = RuntimeResilienceStore = __decorate([
    (0, common_1.Injectable)()
], RuntimeResilienceStore);
//# sourceMappingURL=runtime-resilience.store.js.map