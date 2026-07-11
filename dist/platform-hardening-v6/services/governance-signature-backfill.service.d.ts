import { OnModuleInit } from "@nestjs/common";
import { GovernanceIntegrityRepository } from "./governance-integrity.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";
export declare class GovernanceSignatureBackfillService implements OnModuleInit {
    private readonly repository;
    private readonly payloads;
    private readonly signatures;
    constructor(repository: GovernanceIntegrityRepository, payloads: GovernanceSignaturePayloadService, signatures: GovernanceSignatureService);
    onModuleInit(): Promise<void>;
    backfillAll(): Promise<{
        auditRecordsSigned: number;
        policyVersionsSigned: number;
        completedAt: string;
    }>;
    private backfillAudit;
    private backfillPolicies;
}
