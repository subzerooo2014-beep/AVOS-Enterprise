export declare class CreateApprovalRequestDto {
    title: string;
    description: string;
    requestType: string;
    requestedBy: string;
    requiredApprovers: string[];
    minimumApprovals: number;
    expiresAt?: string;
    entityType: string;
    entityId: string;
    metadata?: Record<string, unknown>;
}
