import { CodeGenArtifactDependencyResolver } from "../../artifacts/resolution/codegen-artifact-dependency-resolver";
import { CodeGenArtifactDescriptor, CodeGenResolvedArtifactPlan } from "../../artifacts/codegen-artifact.contracts";
export declare class CodeGenGenerationPlanner {
    readonly resolver: CodeGenArtifactDependencyResolver;
    constructor(resolver?: CodeGenArtifactDependencyResolver);
    createPlan(artifacts: readonly CodeGenArtifactDescriptor[]): CodeGenResolvedArtifactPlan;
}
//# sourceMappingURL=codegen-generation-planner.d.ts.map