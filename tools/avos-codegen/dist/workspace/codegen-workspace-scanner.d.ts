import { CodeGenFileDescriptor } from "../filesystem/codegen-filesystem.contracts";
export interface ScanWorkspaceOptions {
    includeExtensions?: string[];
    excludeDirectories?: string[];
    maximumDepth?: number;
}
export interface CodeGenWorkspaceSnapshot {
    root: string;
    files: CodeGenFileDescriptor[];
    directories: number;
    totalFiles: number;
    totalBytes: number;
    scannedAt: string;
}
export declare class CodeGenWorkspaceScanner {
    scan(workspaceRoot: string, options?: ScanWorkspaceOptions): Promise<CodeGenWorkspaceSnapshot>;
}
//# sourceMappingURL=codegen-workspace-scanner.d.ts.map