import { AuditLedgerService } from "./audit-ledger.service";
import { PolicyViolationRegistryService } from "./policy-violation-registry.service";
import { RuntimePolicyEngineService } from "./runtime-policy-engine.service";
export declare class PlatformHardeningV5Service {
    private readonly ledger;
    private readonly policies;
    private readonly violations;
    constructor(ledger: AuditLedgerService, policies: RuntimePolicyEngineService, violations: PolicyViolationRegistryService);
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
        enforcementMode: import("..").PolicyEnforcementMode;
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
                enforcementMode: import("..").PolicyEnforcementMode;
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
}
