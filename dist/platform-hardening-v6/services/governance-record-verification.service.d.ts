import { SignedRecordVerification } from "../interfaces/signed-record-verification.interface";
import { GovernanceRecordHashService } from "./governance-record-hash.service";
import { GovernanceReportRepository } from "./governance-report.repository";
import { GovernanceSignatureService } from "./governance-signature.service";
export declare class GovernanceRecordVerificationService {
    private readonly repository;
    private readonly hashes;
    private readonly signatures;
    constructor(repository: GovernanceReportRepository, hashes: GovernanceRecordHashService, signatures: GovernanceSignatureService);
    verifyCompliance(id: string): Promise<SignedRecordVerification>;
    verifyEvidence(id: string): Promise<SignedRecordVerification>;
    private missing;
}
