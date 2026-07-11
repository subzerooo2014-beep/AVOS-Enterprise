import { PolicyEnforcementMode } from "../enums/policy-enforcement-mode.enum";
import { AuditLedgerService } from "../services/audit-ledger.service";
import { PlatformHardeningV5Service } from "../services/platform-hardening-v5.service";
import { PolicyViolationRegistryService } from "../services/policy-violation-registry.service";
import { RuntimePolicyEngineService } from "../services/runtime-policy-engine.service";
export declare class PlatformHardeningV5Controller {
    private readonly hardening;
    private readonly ledger;
    private readonly policies;
    private readonly violations;
    constructor(hardening: PlatformHardeningV5Service, ledger: AuditLedgerService, policies: RuntimePolicyEngineService, violations: PolicyViolationRegistryService);
    getStatus(): {
        success: boolean;
        system: string;
        version: string;
        phase: string;
        environment: string;
        capabilities: {
            immutableAuditLedger: boolean;
            auditHashChain: boolean;
            auditIntegrityVerification: boolean;
            runtimePolicyEngine: boolean;
            policyEnforcementModes: boolean;
            sensitiveOperationClassification: boolean;
            approvalTokenProtection: boolean;
            policyViolationRegistry: boolean;
            securityRiskScoring: boolean;
            protectedDiagnostics: boolean;
        };
        enforcementMode: PolicyEnforcementMode;
        timestamp: string;
        uptimeSeconds: number;
    };
    getSnapshot(): {
        success: boolean;
        system: string;
        hardeningVersion: string;
        generatedAt: string;
        audit: {
            summary: {
                total: number;
                info: number;
                warning: number;
                error: number;
                critical: number;
                latestSequence: number;
                latestHash: string;
            };
            integrity: import("..").AuditIntegrityResult;
        };
        security: {
            risk: {
                enforcementMode: PolicyEnforcementMode;
                totalPolicies: number;
                enabledPolicies: number;
                disabledPolicies: number;
                maximumConfiguredRiskLevel: import("..").RiskLevel;
            };
            violations: {
                total: number;
                denied: number;
                highRisk: number;
                criticalRisk: number;
            };
        };
        policies: import("..").RuntimePolicy[];
    };
    getAudit(limit?: string): {
        success: boolean;
        summary: {
            total: number;
            info: number;
            warning: number;
            error: number;
            critical: number;
            latestSequence: number;
            latestHash: string;
        };
        events: import("..").AuditEvent[];
    };
    verifyAuditIntegrity(): {
        success: boolean;
        integrity: import("..").AuditIntegrityResult;
    };
    getAuditEvent(id: string): {
        success: boolean;
        event: import("..").AuditEvent;
    };
    getPolicies(): {
        success: boolean;
        enforcementMode: PolicyEnforcementMode;
        policies: import("..").RuntimePolicy[];
    };
    setAuditOnlyMode(): {
        success: boolean;
        enforcementMode: PolicyEnforcementMode;
    };
    setEnforceMode(): {
        success: boolean;
        enforcementMode: PolicyEnforcementMode;
    };
    enablePolicy(id: string): {
        success: boolean;
        policy: import("..").RuntimePolicy;
    };
    disablePolicy(id: string): {
        success: boolean;
        policy: import("..").RuntimePolicy;
    };
    getViolations(limit?: string): {
        success: boolean;
        summary: {
            total: number;
            denied: number;
            highRisk: number;
            criticalRisk: number;
        };
        violations: import("..").PolicyViolation[];
    };
}
