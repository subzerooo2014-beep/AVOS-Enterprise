import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
export interface CodeGenWorkspaceSynchronizationResult {
    written: string[];
    unchanged: string[];
    failed: string[];
    warnings: string[];
    completedAt: string;
}
export declare class CodeGenWorkspaceSynchronizer {
    synchronize(targetRoot: string, artifacts: readonly CodeGenArtifactDescriptor[], dryRun?: boolean): Promise<CodeGenWorkspaceSynchronizationResult>;
}
//# sourceMappingURL=codegen-workspace-synchronizer.d.ts.map