import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenWorkspaceSnapshot } from "./codegen-workspace-snapshot.contracts";
export declare class CodeGenWorkspaceSnapshotFactory {
    create(input: {
        sessionId: string;
        workspaceRoot: string;
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        metadata?: CodeGenMetadata;
    }): CodeGenWorkspaceSnapshot;
}
//# sourceMappingURL=codegen-workspace-snapshot-factory.d.ts.map