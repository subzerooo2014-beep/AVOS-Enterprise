import { RunIntegrityScanDto } from "../dto/run-integrity-scan.dto";
import { GovernanceIntegrityScannerService } from "../services/governance-integrity-scanner.service";
import { GovernanceSignatureBackfillService } from "../services/governance-signature-backfill.service";
export declare class GovernanceIntegrityController {
    private readonly scanner;
    private readonly backfill;
    constructor(scanner: GovernanceIntegrityScannerService, backfill: GovernanceSignatureBackfillService);
    summary(): Promise<{
        success: boolean;
        integrity: {
            latestScan: any;
            signatureConfiguration: {
                algorithm: "HMAC-SHA256";
                keyId: string;
                secretConfigured: boolean;
            };
        };
    }>;
    history(limit?: string): Promise<{
        success: boolean;
        scans: any;
    }>;
    scan(dto: RunIntegrityScanDto, request: any): Promise<{
        success: boolean;
        result: import("..").GovernanceIntegrityScanResult;
    }>;
    backfillSignatures(): Promise<{
        success: boolean;
        result: {
            auditRecordsSigned: number;
            policyVersionsSigned: number;
            completedAt: string;
        };
    }>;
}
