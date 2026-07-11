import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenGeneratorV3RendererContext } from "../contracts/codegen-generator-v3.contracts";
import { CodeGenGeneratorV3ArtifactFactory } from "../runtime/codegen-generator-v3-artifact-factory";
export declare class CodeGenGeneratorV3ModuleRenderer {
    readonly artifacts: CodeGenGeneratorV3ArtifactFactory;
    constructor(artifacts?: CodeGenGeneratorV3ArtifactFactory);
    render(context: CodeGenGeneratorV3RendererContext): CodeGenArtifactDescriptor[];
}
//# sourceMappingURL=codegen-generator-v3-module-renderer.d.ts.map