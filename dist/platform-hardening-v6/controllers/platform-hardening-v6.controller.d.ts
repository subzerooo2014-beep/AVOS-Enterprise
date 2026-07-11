import { CreatePersistentAuditEventDto } from "../dto/create-persistent-audit-event.dto";
import { PersistentAuditLedgerService } from "../services/persistent-audit-ledger.service";
import { PlatformHardeningV6Service } from "../services/platform-hardening-v6.service";
export declare class PlatformHardeningV6Controller {
    private readonly hardening;
    private readonly audit;
    constructor(hardening: PlatformHardeningV6Service, audit: PersistentAuditLedgerService);
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
    getAudit(limit?: string, eventType?: string, severity?: string, actor?: string, correlationId?: string): Promise<{
        success: boolean;
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
        events: any;
    }>;
    verifyIntegrity(): Promise<{
        success: boolean;
        integrity: import("..").PersistentIntegrityResult;
    }>;
    getBySequence(sequence: number): Promise<{
        success: boolean;
        event: any;
    }>;
    getById(id: string): Promise<{
        success: boolean;
        event: any;
    }>;
    append(dto: CreatePersistentAuditEventDto): Promise<{
        success: boolean;
        event: any;
    }>;
}
