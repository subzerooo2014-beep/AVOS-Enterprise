import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenArtifactChange, CodeGenIncrementalSnapshot } from "../contracts/codegen-incremental.contracts";
import { CodeGenArtifactStateFactory } from "./codegen-artifact-state-factory";
export declare class CodeGenIncrementalChangeDetector {
    readonly states: CodeGenArtifactStateFactory;
    constructor(states?: CodeGenArtifactStateFactory);
    detect(artifacts: readonly CodeGenArtifactDescriptor[], snapshot?: CodeGenIncrementalSnapshot): CodeGenArtifactChange[];
}
//# sourceMappingURL=codegen-incremental-change-detector.d.ts.map