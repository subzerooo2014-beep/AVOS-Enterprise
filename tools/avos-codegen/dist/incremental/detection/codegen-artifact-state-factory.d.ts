import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenArtifactState } from "../contracts/codegen-incremental.contracts";
export declare class CodeGenArtifactStateFactory {
    create(artifact: CodeGenArtifactDescriptor): CodeGenArtifactState;
    createMany(artifacts: readonly CodeGenArtifactDescriptor[]): CodeGenArtifactState[];
}
//# sourceMappingURL=codegen-artifact-state-factory.d.ts.map