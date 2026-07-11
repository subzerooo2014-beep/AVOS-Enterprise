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
exports.ResiliencePolicyService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
let ResiliencePolicyService = class ResiliencePolicyService {
    constructor(store, evidence) {
        this.store = store;
        this.evidence = evidence;
    }
    create(dto) {
        const existing = this.store.findPoliciesByKey(dto.key);
        const version = existing.length === 0
            ? 1
            : Math.max(...existing.map((item) => item.version)) + 1;
        const now = new Date().toISOString();
        const policy = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            version,
            status: runtime_resilience_enums_1.ResiliencePolicyStatus.DRAFT,
            environment: dto.environment,
            namespace: dto.namespace,
            rules: dto.rules
                .map((rule) => ({
                id: rule.id,
                name: rule.name,
                description: rule.description,
                priority: rule.priority,
                enabled: rule.enabled,
                conditions: rule.conditions.map((condition) => ({
                    field: condition.field,
                    operator: condition.operator,
                    value: condition.value,
                })),
                decision: rule.decision,
                riskLevel: rule.riskLevel,
                requiredApprovals: rule.requiredApprovals,
                actionTypes: rule.actionTypes,
                metadata: (rule.metadata ?? {}),
            }))
                .sort((a, b) => b.priority - a.priority),
            defaultDecision: dto.defaultDecision,
            defaultRiskLevel: dto.defaultRiskLevel,
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.savePolicy(policy);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.POLICY_CREATED,
            aggregateType: "resilience_policy",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                policyId: saved.id,
                key: saved.key,
                version: saved.version,
                status: saved.status,
                rules: saved.rules.length,
            },
        });
        return saved;
    }
    list() {
        return this.store.listPolicies();
    }
    get(id) {
        const policy = this.store.getPolicy(id);
        if (!policy) {
            throw new common_1.NotFoundException(`Resilience policy ${id} was not found`);
        }
        return policy;
    }
    activate(id, actor) {
        const policy = this.get(id);
        if (policy.status !== runtime_resilience_enums_1.ResiliencePolicyStatus.DRAFT) {
            throw new common_1.BadRequestException(`Only draft policies can be activated. Current status: ${policy.status}`);
        }
        const now = new Date().toISOString();
        const activeVersions = this.store
            .findPoliciesByKey(policy.key)
            .filter((item) => item.status === runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE &&
            item.id !== policy.id);
        for (const active of activeVersions) {
            active.status = runtime_resilience_enums_1.ResiliencePolicyStatus.ARCHIVED;
            active.archivedAt = now;
            active.updatedAt = now;
            this.store.savePolicy(active);
        }
        policy.status = runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE;
        policy.activatedAt = now;
        policy.updatedAt = now;
        const saved = this.store.savePolicy(policy);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.POLICY_ACTIVATED,
            aggregateType: "resilience_policy",
            aggregateId: saved.id,
            actor,
            payload: {
                policyId: saved.id,
                key: saved.key,
                version: saved.version,
                archivedPolicyIds: activeVersions.map((item) => item.id),
            },
        });
        return saved;
    }
    disable(id, actor) {
        const policy = this.get(id);
        if (policy.status !== runtime_resilience_enums_1.ResiliencePolicyStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Only active policies can be disabled. Current status: ${policy.status}`);
        }
        const now = new Date().toISOString();
        policy.status = runtime_resilience_enums_1.ResiliencePolicyStatus.DISABLED;
        policy.disabledAt = now;
        policy.updatedAt = now;
        const saved = this.store.savePolicy(policy);
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.POLICY_ACTIVATED,
            aggregateType: "resilience_policy",
            aggregateId: saved.id,
            actor,
            payload: {
                policyId: saved.id,
                status: saved.status,
                operation: "disabled",
            },
        });
        return saved;
    }
};
exports.ResiliencePolicyService = ResiliencePolicyService;
exports.ResiliencePolicyService = ResiliencePolicyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService])
], ResiliencePolicyService);
//# sourceMappingURL=resilience-policy.service.js.map