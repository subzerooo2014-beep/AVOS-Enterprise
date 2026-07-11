"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyViolationRegistryService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let PolicyViolationRegistryService = class PolicyViolationRegistryService {
    constructor() {
        this.violations = [];
    }
    register(input) {
        const violation = {
            id: (0, node_crypto_1.randomUUID)(),
            policyIds: input.evaluation.matchedPolicyIds,
            method: input.method,
            path: input.path,
            decision: input.evaluation.decision,
            riskLevel: input.evaluation.riskLevel,
            riskScore: input.evaluation.riskScore,
            reasons: input.evaluation.reasons,
            correlationId: input.correlationId,
            traceId: input.traceId,
            actor: input.actor,
            createdAt: new Date().toISOString(),
        };
        this.violations.unshift(violation);
        if (this.violations.length > 5000) {
            this.violations.length = 5000;
        }
        return { ...violation };
    }
    findAll(limit = 100) {
        return this.violations
            .slice(0, Math.min(Math.max(limit, 1), 1000))
            .map((item) => ({
            ...item,
            policyIds: [...item.policyIds],
            reasons: [...item.reasons],
        }));
    }
    getSummary() {
        return {
            total: this.violations.length,
            denied: this.violations.filter((item) => item.decision === "deny").length,
            highRisk: this.violations.filter((item) => item.riskLevel === "high").length,
            criticalRisk: this.violations.filter((item) => item.riskLevel === "critical").length,
        };
    }
};
exports.PolicyViolationRegistryService = PolicyViolationRegistryService;
exports.PolicyViolationRegistryService = PolicyViolationRegistryService = __decorate([
    (0, common_1.Injectable)()
], PolicyViolationRegistryService);
//# sourceMappingURL=policy-violation-registry.service.js.map