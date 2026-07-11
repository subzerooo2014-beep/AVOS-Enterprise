export declare function sha256Text(value: string): string;
export declare function sha256Json(value: unknown): string;
export declare function buildEvidenceEntryHash(input: {
    sequence: number;
    type: string;
    aggregateType: string;
    aggregateId: string;
    actor: unknown;
    payloadHash: string;
    previousHash: string;
    createdAt: string;
}): string;
