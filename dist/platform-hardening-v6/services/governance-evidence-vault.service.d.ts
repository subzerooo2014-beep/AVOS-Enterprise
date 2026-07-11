import { GovernanceIntegrityScannerService } from "./governance-integrity-scanner.service";
import { GovernanceRecordHashService } from "./governance-record-hash.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyVersioningService } from "./policy-versioning.service";
export declare class GovernanceEvidenceVaultService {
    private readonly audit;
    private readonly policies;
    private readonly scanner;
    private readonly repository;
    private readonly hashes;
    private readonly signatures;
    constructor(audit: PersistentAuditLedgerService, policies: PolicyVersioningService, scanner: GovernanceIntegrityScannerService, repository: GovernanceReportRepository, hashes: GovernanceRecordHashService, signatures: GovernanceSignatureService);
    generate(input?: {
        packageType?: string;
        description?: string;
        generatedBy?: string;
        correlationId?: string;
        traceId?: string;
    }): Promise<any>;
    findAll(limit?: number): any;
    findOne(id: string): Promise<any>;
    latest(): any;
    private determineStatus;
}
