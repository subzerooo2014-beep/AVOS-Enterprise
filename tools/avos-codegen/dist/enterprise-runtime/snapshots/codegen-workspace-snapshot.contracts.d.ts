import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
export interface CodeGenWorkspaceSnapshot {
    id: string;
    sessionId: string;
    workspaceRoot: string;
    targetRoot: string;
    artifacts: CodeGenArtifactDescriptor[];
    metadata: CodeGenMetadata;
    createdAt: string;
}
export interface CodeGenWorkspaceSnapshotManifest {
    snapshots: Array<{
        id: string;
        sessionId: string;
        createdAt: string;
        artifacts: number;
    }>;
    generatedAt: string;
}
//# sourceMappingURL=codegen-workspace-snapshot.contracts.d.ts.map