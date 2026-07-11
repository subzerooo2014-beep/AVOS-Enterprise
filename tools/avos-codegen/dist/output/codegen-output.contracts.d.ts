import { CodeGenMetadata } from "../core/codegen.contracts";
export declare enum CodeGenConflictPolicy {
    ERROR = "error",
    SKIP = "skip",
    OVERWRITE = "overwrite",
    OVERWRITE_IF_UNCHANGED = "overwrite_if_unchanged"
}
export declare enum CodeGenConflictType {
    NONE = "none",
    FILE_EXISTS = "file_exists",
    CONTENT_CHANGED = "content_changed",
    PATH_OUTSIDE_TARGET = "path_outside_target",
    LOCKED = "locked"
}
export interface CodeGenFileFingerprint {
    absolutePath: string;
    exists: boolean;
    sizeBytes: number;
    checksum?: string;
    modifiedAt?: string;
    generatedAt: string;
}
export interface CodeGenOutputConflict {
    artifactKey: string;
    absolutePath: string;
    type: CodeGenConflictType;
    policy: CodeGenConflictPolicy;
    allowed: boolean;
    reason: string;
    existingFingerprint?: CodeGenFileFingerprint;
    expectedFingerprint?: CodeGenFileFingerprint;
    detectedAt: string;
}
export interface CodeGenAtomicWriteRequest {
    absolutePath: string;
    content: string;
    encoding?: BufferEncoding;
}
export interface CodeGenAtomicWriteResult {
    absolutePath: string;
    temporaryPath: string;
    checksum: string;
    bytes: number;
    writtenAt: string;
}
export interface CodeGenWorkspaceLock {
    id: string;
    workspaceRoot: string;
    lockPath: string;
    processId: number;
    hostname: string;
    acquiredAt: string;
    expiresAt: string;
    metadata: CodeGenMetadata;
}
export interface CodeGenOutputManifestEntry {
    artifactKey: string;
    relativePath: string;
    absolutePath: string;
    checksum: string;
    bytes: number;
    status: "written" | "skipped" | "preview";
    generatedAt: string;
}
export interface CodeGenOutputManifest {
    id: string;
    sessionId: string;
    workspaceRoot: string;
    targetRoot: string;
    entries: CodeGenOutputManifestEntry[];
    checksum: string;
    generatedAt: string;
}
export interface CodeGenGenerationReport {
    sessionId: string;
    success: boolean;
    dryRun: boolean;
    artifacts: number;
    written: number;
    skipped: number;
    conflicts: number;
    integrityValid: boolean;
    manifestPath?: string;
    reportPath?: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    warnings: string[];
    errors: string[];
}
export interface CodeGenIntegrityResult {
    valid: boolean;
    checked: number;
    missing: string[];
    mismatched: Array<{
        absolutePath: string;
        expectedChecksum: string;
        actualChecksum?: string;
    }>;
    verifiedAt: string;
}
export interface CodeGenPreviewEntry {
    artifactKey: string;
    relativePath: string;
    absolutePath: string;
    action: "create" | "overwrite" | "skip" | "error";
    conflictType: CodeGenConflictType;
    checksum: string;
    bytes: number;
}
export interface CodeGenPreviewResult {
    valid: boolean;
    entries: CodeGenPreviewEntry[];
    conflicts: CodeGenOutputConflict[];
    generatedAt: string;
}
//# sourceMappingURL=codegen-output.contracts.d.ts.map