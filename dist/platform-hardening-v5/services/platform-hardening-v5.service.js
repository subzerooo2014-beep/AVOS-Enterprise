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
exports.PlatformHardeningV5Service = void 0;
const common_1 = require("@nestjs/common");
const audit_ledger_service_1 = require("./audit-ledger.service");
const policy_violation_registry_service_1 = require("./policy-violation-registry.service");
const runtime_policy_engine_service_1 = require("./runtime-policy-engine.service");
let PlatformHardeningV5Service = class PlatformHardeningV5Service {
    constructor(ledger, policies, violations) {
        this.ledger = ledger;
        this.policies = policies;
        this.violations = violations;
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v5",
            phase: "security-governance-audit-integrity-and-runtime-policy",
            environment: process.env.NODE_ENV ??
                "development",
            capabilities: {
                immutableAuditLedger: true,
                auditHashChain: true,
                auditIntegrityVerification: true,
                runtimePolicyEngine: true,
                policyEnforcementModes: true,
                sensitiveOperationClassification: true,
                approvalTokenProtection: true,
                policyViolationRegistry: true,
                securityRiskScoring: true,
                protectedDiagnostics: true,
            },
            enforcementMode: this.policies.getMode(),
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
        };
    }
    getSnapshot() {
        const integrity = this.ledger.verifyIntegrity();
        return {
            success: true,
            system: "AVOS Enterprise Production",
            hardeningVersion: "v5",
            generatedAt: new Date().toISOString(),
            audit: {
                summary: this.ledger.getSummary(),
                integrity,
            },
            security: {
                risk: this.policies.getSecurityRiskSummary(),
                violations: this.violations.getSummary(),
            },
            policies: this.policies.findAll(),
        };
    }
};
exports.PlatformHardeningV5Service = PlatformHardeningV5Service;
exports.PlatformHardeningV5Service = PlatformHardeningV5Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_ledger_service_1.AuditLedgerService,
        runtime_policy_engine_service_1.RuntimePolicyEngineService,
        policy_violation_registry_service_1.PolicyViolationRegistryService])
], PlatformHardeningV5Service);
//# sourceMappingURL=platform-hardening-v5.service.js.map