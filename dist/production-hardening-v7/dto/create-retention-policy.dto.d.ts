export declare class CreateRetentionPolicyDto {
    policyCode: string;
    resourceType: string;
    retentionDays: number;
    archiveAfterDays?: number;
    purgeAfterDays?: number;
    legalHoldSupported?: boolean;
    enabled?: boolean;
    description: string;
}
