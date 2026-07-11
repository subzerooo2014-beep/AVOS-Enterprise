export declare class UpdateVersionedPolicyDto {
    name?: string;
    description?: string;
    enabled?: boolean;
    methods?: string[];
    pathPrefixes?: string[];
    requireApprovalToken?: boolean;
    blockInProduction?: boolean;
    severity?: string;
    changeReason: string;
    changedBy?: string;
}
