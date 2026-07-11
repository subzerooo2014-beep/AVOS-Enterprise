import { PersistentAuditInput } from "../interfaces/persistent-audit-input.interface";
import { PersistentIntegrityResult } from "../interfaces/persistent-integrity-result.interface";
import { PersistentAuditRepository } from "./persistent-audit.repository";
import { GovernanceSignaturePayloadService } from "./governance-signature-payload.service";
import { GovernanceSignatureService } from "./governance-signature.service";
export declare class PersistentAuditLedgerService {
    private readonly repository;
    private readonly signatures;
    private readonly signaturePayloads;
    private writeQueue;
    constructor(repository: PersistentAuditRepository, signatures: GovernanceSignatureService, signaturePayloads: GovernanceSignaturePayloadService);
    append(input: PersistentAuditInput): Promise<any>;
    private appendInternal;
    findMany(input?: {
        limit?: number;
        eventType?: string;
        severity?: string;
        actor?: string;
        correlationId?: string;
    }): Promise<any>;
    findOne(id: string): Promise<any>;
    findBySequence(sequence: number): Promise<any>;
    getSummary(): Promise<{
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
    }>;
    verifyIntegrity(): Promise<PersistentIntegrityResult>;
}
