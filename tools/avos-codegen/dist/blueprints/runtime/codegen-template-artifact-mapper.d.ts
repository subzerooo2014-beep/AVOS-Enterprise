import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenRenderedTemplate } from "../../templates/codegen-template.contracts";
export declare class CodeGenTemplateArtifactMapper {
    map(input: {
        blueprintKey: string;
        rendered: CodeGenRenderedTemplate;
        order: number;
    }): CodeGenArtifactDescriptor;
}
//# sourceMappingURL=codegen-template-artifact-mapper.d.ts.map