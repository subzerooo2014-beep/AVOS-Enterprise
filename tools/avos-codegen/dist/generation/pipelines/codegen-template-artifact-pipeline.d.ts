import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenTemplateEngine } from "../../templates/codegen-template-engine";
import { CodeGenJsonValue, CodeGenMetadata } from "../../core/codegen.contracts";
export interface CodeGenTemplateArtifactPipelineRequest {
    templateKeys: readonly string[];
    variables: Record<string, CodeGenJsonValue>;
    strict: boolean;
    metadata?: CodeGenMetadata;
}
export declare class CodeGenTemplateArtifactPipeline {
    readonly templates: CodeGenTemplateEngine;
    constructor(templates?: CodeGenTemplateEngine);
    execute(request: CodeGenTemplateArtifactPipelineRequest): CodeGenArtifactDescriptor[];
    private resolveArtifactType;
}
//# sourceMappingURL=codegen-template-artifact-pipeline.d.ts.map