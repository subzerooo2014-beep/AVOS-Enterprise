import { CodeGenMetadata } from "../../core/codegen.contracts";
export interface CodeGenWorkspaceFileRecord {
    relativePath: string;
    absolutePath: string;
    extension: string;
    sizeBytes: number;
    modifiedAt: string;
    checksum?: string;
    metadata: CodeGenMetadata;
}
export interface CodeGenWorkspaceScanOptions {
    includeExtensions: readonly string[];
    excludeDirectories: readonly string[];
    includeHidden: boolean;
    calculateChecksums: boolean;
    maximumFiles: number;
}
export interface CodeGenWorkspaceScanResult {
    workspaceRoot: string;
    files: CodeGenWorkspaceFileRecord[];
    scannedDirectories: number;
    skippedDirectories: number;
    warnings: string[];
    errors: string[];
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-workspace.contracts.d.ts.map