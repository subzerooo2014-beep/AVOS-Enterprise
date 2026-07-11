import { CodeGenTemplateDocumentNode, CodeGenTemplateToken } from "../contracts/codegen-template-v2.contracts";
export declare class CodeGenTemplateParserV2 {
    parse(tokens: readonly CodeGenTemplateToken[]): CodeGenTemplateDocumentNode;
    private closeFrame;
    private parseEachExpression;
}
//# sourceMappingURL=codegen-template-parser-v2.d.ts.map