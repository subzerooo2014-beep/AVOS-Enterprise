import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenExecutionPlan } from "../../planning/contracts/codegen-planning.contracts";
import { CodeGenIncrementalSnapshot } from "../contracts/codegen-incremental.contracts";
import { CodeGenArtifactStateFactory } from "../detection/codegen-artifact-state-factory";
export declare class CodeGenIncrementalSnapshotFactory {
    readonly states: CodeGenArtifactStateFactory;
    constructor(states?: CodeGenArtifactStateFactory);
    create(input: {
        workspaceRoot: string;
        targetRoot: string;
        artifacts: readonly CodeGenArtifactDescriptor[];
        executionPlan?: CodeGenExecutionPlan;
        metadata?: CodeGenMetadata;
        previous?: CodeGenIncrementalSnapshot;
    }): CodeGenIncrementalSnapshot;
}
//# sourceMappingURL=codegen-incremental-snapshot-factory.d.ts.map