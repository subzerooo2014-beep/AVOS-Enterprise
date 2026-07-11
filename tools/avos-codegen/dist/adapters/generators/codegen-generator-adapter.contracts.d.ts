import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenGeneratorContext, CodeGenGeneratorResult } from "../../generators/codegen-generator.contracts";
export interface CodeGenGeneratorAdapterRequest {
    generatorKey: string;
    context: CodeGenGeneratorContext;
}
export interface CodeGenGeneratorAdapterResult {
    generatorResult: CodeGenGeneratorResult;
    artifacts: CodeGenArtifactDescriptor[];
    warnings: string[];
    adaptedAt: string;
}
//# sourceMappingURL=codegen-generator-adapter.contracts.d.ts.map