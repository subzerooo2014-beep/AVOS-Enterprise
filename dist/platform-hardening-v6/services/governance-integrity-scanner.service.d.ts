import { PolicyChecksumService } from "./policy-checksum.service";
import { GovernanceIntegrityRepository } from "./governance-integrity.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";
import { GovernanceIntegrityScanResult } from "../interfaces/governance-integrity-scan-result.interface";
export declare class GovernanceIntegrityScannerService {
    private readonly repository;
    private readonly signatures;
    private readonly payloads;
    private readonly checksums;
    constructor(repository: GovernanceIntegrityRepository, signatures: GovernanceSignatureService, payloads: GovernanceSignaturePayloadService, checksums: PolicyChecksumService);
    run(input?: {
        scope?: "all" | "audit" | "policies";
        executedBy?: string;
        correlationId?: string;
        traceId?: string;
    }): Promise<GovernanceIntegrityScanResult>;
    getSummary(): Promise<{
        latestScan: any;
        signatureConfiguration: {
            algorithm: "HMAC-SHA256";
            keyId: string;
            secretConfigured: boolean;
        };
    }>;
    getHistory(limit?: number): any;
    private scanAudit;
    private scanPolicies;
    private toStringArray;
}
