export interface PersistentIntegrityResult {
    valid: boolean;
    totalEvents: number;
    verifiedEvents: number;
    firstSequence?: number;
    lastSequence?: number;
    invalidSequence?: number;
    expectedPreviousHash?: string;
    actualPreviousHash?: string;
    expectedHash?: string;
    actualHash?: string;
    checkedAt: string;
}
