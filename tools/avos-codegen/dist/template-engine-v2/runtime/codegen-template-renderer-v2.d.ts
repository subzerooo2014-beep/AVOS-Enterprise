import { CodeGenTemplateDocumentNode, CodeGenTemplateValue } from "../contracts/codegen-template-v2.contracts";
import { CodeGenTemplateExpressionResolverV2 } from "./codegen-template-expression-resolver-v2";
export declare class CodeGenTemplateRendererV2 {
    readonly expressions: CodeGenTemplateExpressionResolverV2;
    constructor(expressions?: CodeGenTemplateExpressionResolverV2);
    render(document: CodeGenTemplateDocumentNode, variables: Record<string, CodeGenTemplateValue>, options: {
        strict: boolean;
        preserveComments: boolean;
    }): string;
    private renderNodes;
}
//# sourceMappingURL=codegen-template-renderer-v2.d.ts.map