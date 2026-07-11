import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenConflictPolicy, CodeGenPreviewResult } from "../codegen-output.contracts";
import { CodeGenOutputConflictDetector } from "../conflicts/codegen-output-conflict-detector";
export declare class CodeGenOutputPreviewEngine {
    readonly conflicts: CodeGenOutputConflictDetector;
    constructor(conflicts?: CodeGenOutputConflictDetector);
    preview(input: {
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        policy: CodeGenConflictPolicy;
    }): Promise<CodeGenPreviewResult>;
}
//# sourceMappingURL=codegen-output-preview-engine.d.ts.map