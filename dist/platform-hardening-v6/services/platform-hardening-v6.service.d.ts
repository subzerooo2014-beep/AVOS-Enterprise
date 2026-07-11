import { GovernanceIntegrityScannerService } from "./governance-integrity-scanner.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyVersioningService } from "./policy-versioning.service";
export declare class PlatformHardeningV6Service {
    private readonly audit;
    private readonly policies;
    private readonly scanner;
    private readonly signatures;
    private readonly reports;
    constructor(audit: PersistentAuditLedgerService, policies: PolicyVersioningService, scanner: GovernanceIntegrityScannerService, signatures: GovernanceSignatureService, reports: GovernanceReportRepository);
    getStatus(): {
        success: boolean;
        system: string;
        version: string;
        phase: string;
        environment: string;
        capabilities: {
            persistentDatabaseAuditLedger: boolean;
            cryptographicHashChain: boolean;
            persistentPolicyRegistry: boolean;
            policyVersioning: boolean;
            safePolicyRollback: boolean;
            digitalAuditSignatures: boolean;
            digitalPolicySignatures: boolean;
            tamperDetection: boolean;
            integrityScanner: boolean;
            complianceSnapshots: boolean;
            signedComplianceReports: boolean;
            securityEvidenceVault: boolean;
            exportableAuditPackages: boolean;
            evidenceChecksums: boolean;
            evidenceDigitalSignatures: boolean;
            evidenceVerification: boolean;
        };
        signatureConfiguration: {
            algorithm: "HMAC-SHA256";
            keyId: string;
            secretConfigured: boolean;
        };
        timestamp: string;
        uptimeSeconds: number;
    };
    getSnapshot(): Promise<{
        success: boolean;
        system: string;
        hardeningVersion: string;
        generatedAt: string;
        persistentAudit: {
            summary: {
                total: any;
                firstSequence: any;
                latestSequence: any;
                genesisHash: any;
                latestHash: any;
                severityCounts: {
                    [k: string]: any;
                };
                eventTypeCounts: {
                    [k: string]: any;
                };
            };
            integrity: import("..").PersistentIntegrityResult;
        };
        persistentGovernance: {
            policyVersioning: {
                totalPolicies: any;
                totalVersions: any;
                enabledPolicies: any;
                disabledPolicies: any;
                averageVersionsPerPolicy: number;
            };
        };
        signedGovernance: {
            configuration: {
                algorithm: "HMAC-SHA256";
                keyId: string;
                secretConfigured: boolean;
            };
            integrity: {
                latestScan: any;
                signatureConfiguration: {
                    algorithm: "HMAC-SHA256";
                    keyId: string;
                    secretConfigured: boolean;
                };
            };
        };
        complianceAndEvidence: {
            complianceSnapshots: any;
            evidencePackages: any;
            latestCompliance: {
                id: any;
                status: any;
                reportType: any;
                generatedAt: any;
            } | null;
            latestEvidence: {
                id: any;
                status: any;
                packageType: any;
                generatedAt: any;
            } | null;
        };
    }>;
}
