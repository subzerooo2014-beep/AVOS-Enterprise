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
exports.RuntimePolicyEngineService = void 0;
const common_1 = require("@nestjs/common");
const audit_severity_enum_1 = require("../enums/audit-severity.enum");
const policy_decision_enum_1 = require("../enums/policy-decision.enum");
const policy_enforcement_mode_enum_1 = require("../enums/policy-enforcement-mode.enum");
const risk_level_enum_1 = require("../enums/risk-level.enum");
let RuntimePolicyEngineService = class RuntimePolicyEngineService {
    constructor() {
        this.mode = this.readMode(process.env.AVOS_POLICY_ENFORCEMENT_MODE);
        this.policies = new Map();
        this.seedPolicies();
    }
    evaluate(input) {
        const method = input.method.toUpperCase();
        const path = input.path.split("?")[0];
        const environment = input.environment ??
            process.env.NODE_ENV ??
            "development";
        const matchedPolicies = Array.from(this.policies.values())
            .filter((policy) => {
            if (!policy.enabled) {
                return false;
            }
            const methodMatched = policy.methods.includes(method) ||
                policy.methods.includes("*");
            const pathMatched = policy.pathPrefixes.some((prefix) => path === prefix ||
                path.startsWith(`${prefix}/`));
            return methodMatched && pathMatched;
        });
        if (matchedPolicies.length === 0) {
            return {
                decision: policy_decision_enum_1.PolicyDecision.ALLOW,
                riskLevel: risk_level_enum_1.RiskLevel.LOW,
                riskScore: 0,
                matchedPolicyIds: [],
                reasons: [],
                approvalRequired: false,
                evaluatedAt: new Date().toISOString(),
            };
        }
        const reasons = [];
        let riskScore = 0;
        let approvalRequired = false;
        let deny = false;
        for (const policy of matchedPolicies) {
            riskScore += this.severityScore(policy.severity);
            if (policy.requireApprovalToken) {
                approvalRequired = true;
                const expected = process.env.AVOS_POLICY_APPROVAL_TOKEN ??
                    "avos-dev-policy-approval";
                if (!input.approvalToken ||
                    input.approvalToken !== expected) {
                    reasons.push(`${policy.name}: approval token is required`);
                    deny = true;
                }
            }
            if (policy.blockInProduction &&
                environment === "production") {
                reasons.push(`${policy.name}: blocked in production`);
                deny = true;
            }
        }
        riskScore = Math.min(100, riskScore);
        const riskLevel = this.calculateRiskLevel(riskScore);
        let decision;
        if (deny &&
            this.mode ===
                policy_enforcement_mode_enum_1.PolicyEnforcementMode.ENFORCE) {
            decision = policy_decision_enum_1.PolicyDecision.DENY;
        }
        else if (deny) {
            decision =
                policy_decision_enum_1.PolicyDecision.ALLOW_WITH_WARNING;
        }
        else {
            decision = policy_decision_enum_1.PolicyDecision.ALLOW;
        }
        return {
            decision,
            riskLevel,
            riskScore,
            matchedPolicyIds: matchedPolicies.map((policy) => policy.id),
            reasons,
            approvalRequired,
            evaluatedAt: new Date().toISOString(),
        };
    }
    getMode() {
        return this.mode;
    }
    setMode(mode) {
        this.mode = mode;
        return this.mode;
    }
    findAll() {
        return Array.from(this.policies.values())
            .map((policy) => ({
            ...policy,
            methods: [...policy.methods],
            pathPrefixes: [
                ...policy.pathPrefixes,
            ],
        }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    setEnabled(id, enabled) {
        const policy = this.policies.get(id);
        if (!policy) {
            return null;
        }
        policy.enabled = enabled;
        policy.updatedAt =
            new Date().toISOString();
        this.policies.set(id, policy);
        return {
            ...policy,
            methods: [...policy.methods],
            pathPrefixes: [
                ...policy.pathPrefixes,
            ],
        };
    }
    getSecurityRiskSummary() {
        const enabledPolicies = this.findAll().filter((item) => item.enabled);
        const maximumRiskScore = enabledPolicies.reduce((highest, policy) => Math.max(highest, this.severityScore(policy.severity)), 0);
        return {
            enforcementMode: this.mode,
            totalPolicies: this.policies.size,
            enabledPolicies: enabledPolicies.length,
            disabledPolicies: this.policies.size -
                enabledPolicies.length,
            maximumConfiguredRiskLevel: this.calculateRiskLevel(maximumRiskScore),
        };
    }
    seedPolicies() {
        const timestamp = new Date().toISOString();
        const defaults = [
            {
                id: "protect-user-deletion",
                name: "Protect User Deletion",
                description: "Requires explicit approval before deleting users",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/users"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: audit_severity_enum_1.AuditSeverity.CRITICAL,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                id: "protect-customer-deletion",
                name: "Protect Customer Deletion",
                description: "Requires explicit approval before deleting customers",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/customers"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: audit_severity_enum_1.AuditSeverity.ERROR,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                id: "protect-vehicle-deletion",
                name: "Protect Vehicle Deletion",
                description: "Requires explicit approval before deleting vehicles",
                enabled: true,
                methods: ["DELETE"],
                pathPrefixes: ["/vehicles"],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: audit_severity_enum_1.AuditSeverity.ERROR,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                id: "protect-system-configuration",
                name: "Protect System Configuration",
                description: "Requires approval for sensitive configuration changes",
                enabled: true,
                methods: ["POST", "PUT", "PATCH"],
                pathPrefixes: [
                    "/platform-hardening",
                    "/system-config",
                    "/settings/security",
                ],
                requireApprovalToken: true,
                blockInProduction: false,
                severity: audit_severity_enum_1.AuditSeverity.CRITICAL,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
            {
                id: "block-development-reset",
                name: "Block Development Reset",
                description: "Blocks reset endpoints in production",
                enabled: true,
                methods: ["POST", "DELETE"],
                pathPrefixes: [
                    "/dev/reset",
                    "/test/reset",
                    "/seed/reset",
                ],
                requireApprovalToken: false,
                blockInProduction: true,
                severity: audit_severity_enum_1.AuditSeverity.CRITICAL,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        ];
        for (const policy of defaults) {
            this.policies.set(policy.id, policy);
        }
    }
    severityScore(severity) {
        switch (severity) {
            case audit_severity_enum_1.AuditSeverity.INFO:
                return 10;
            case audit_severity_enum_1.AuditSeverity.WARNING:
                return 30;
            case audit_severity_enum_1.AuditSeverity.ERROR:
                return 60;
            case audit_severity_enum_1.AuditSeverity.CRITICAL:
                return 90;
            default:
                return 0;
        }
    }
    calculateRiskLevel(score) {
        if (score >= 80) {
            return risk_level_enum_1.RiskLevel.CRITICAL;
        }
        if (score >= 50) {
            return risk_level_enum_1.RiskLevel.HIGH;
        }
        if (score >= 20) {
            return risk_level_enum_1.RiskLevel.MEDIUM;
        }
        return risk_level_enum_1.RiskLevel.LOW;
    }
    readMode(value) {
        if (value ===
            policy_enforcement_mode_enum_1.PolicyEnforcementMode.ENFORCE) {
            return policy_enforcement_mode_enum_1.PolicyEnforcementMode.ENFORCE;
        }
        return policy_enforcement_mode_enum_1.PolicyEnforcementMode.AUDIT_ONLY;
    }
};
exports.RuntimePolicyEngineService = RuntimePolicyEngineService;
exports.RuntimePolicyEngineService = RuntimePolicyEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RuntimePolicyEngineService);
//# sourceMappingURL=runtime-policy-engine.service.js.map