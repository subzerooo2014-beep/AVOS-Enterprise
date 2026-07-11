import { CreateVersionedPolicyDto } from "../dto/create-versioned-policy.dto";
import { RollbackPolicyDto } from "../dto/rollback-policy.dto";
import { UpdateVersionedPolicyDto } from "../dto/update-versioned-policy.dto";
import { PolicyVersionComparison } from "../interfaces/policy-version-comparison.interface";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyChecksumService } from "./policy-checksum.service";
import { PolicyVersionRepository } from "./policy-version.repository";
export declare class PolicyVersioningService {
    private readonly repository;
    private readonly checksum;
    private readonly audit;
    constructor(repository: PolicyVersionRepository, checksum: PolicyChecksumService, audit: PersistentAuditLedgerService);
    create(dto: CreateVersionedPolicyDto, context?: {
        correlationId?: string;
        traceId?: string;
        actor?: string;
    }): Promise<{
        policy: any;
        version: any;
    }>;
    update(id: string, dto: UpdateVersionedPolicyDto, context?: {
        correlationId?: string;
        traceId?: string;
        actor?: string;
    }): Promise<{
        policy: any;
        version: any;
    }>;
    rollback(id: string, dto: RollbackPolicyDto, context?: {
        correlationId?: string;
        traceId?: string;
        actor?: string;
    }): Promise<{
        policy: any;
        version: any;
        restoredFromVersion: number;
    }>;
    compare(id: string, fromVersion: number, toVersion: number): Promise<PolicyVersionComparison>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    history(id: string, limit?: number): any;
    getSummary(): Promise<{
        totalPolicies: any;
        totalVersions: any;
        enabledPolicies: any;
        disabledPolicies: any;
        averageVersionsPerPolicy: number;
    }>;
    private requirePolicy;
    private normalizePayload;
    private toStringArray;
    private normalizeComparable;
}
