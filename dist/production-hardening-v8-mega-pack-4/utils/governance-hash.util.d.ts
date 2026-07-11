export declare function governanceSha256Text(value: string): string;
export declare function governanceSha256Json(value: unknown): string;
export declare function buildGovernanceAuditHash(input: {
    sequence: number;
    type: string;
    aggregateType: string;
    aggregateId: string;
    actor: unknown;
    payloadHash: string;
    previousHash: string;
    createdAt: string;
}): string;
