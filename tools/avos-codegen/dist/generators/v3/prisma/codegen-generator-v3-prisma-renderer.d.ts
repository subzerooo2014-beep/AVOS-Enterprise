import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenGeneratorV3RendererContext } from "../contracts/codegen-generator-v3.contracts";
import { CodeGenGeneratorV3FieldRenderer } from "../renderers/codegen-generator-v3-field-renderer";
import { CodeGenGeneratorV3ArtifactFactory } from "../runtime/codegen-generator-v3-artifact-factory";
export declare class CodeGenGeneratorV3PrismaRenderer {
    readonly fields: CodeGenGeneratorV3FieldRenderer;
    readonly artifacts: CodeGenGeneratorV3ArtifactFactory;
    constructor(fields?: CodeGenGeneratorV3FieldRenderer, artifacts?: CodeGenGeneratorV3ArtifactFactory);
    render(context: CodeGenGeneratorV3RendererContext): CodeGenArtifactDescriptor[];
}
//# sourceMappingURL=codegen-generator-v3-prisma-renderer.d.ts.map