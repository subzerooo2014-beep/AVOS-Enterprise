export declare class CreateKeyRecordDto {
    keyAlias: string;
    purpose: string;
    algorithm: string;
    provider: string;
    status?: "planned" | "active" | "rotation_due" | "rotating" | "retired" | "revoked";
    activatedAt?: string;
    rotationDueAt?: string;
    fingerprint?: string;
    metadata?: Record<string, unknown>;
}
