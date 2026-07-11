import { CodeGenTemplateCompileResult, CodeGenTemplateDocumentNode } from "../contracts/codegen-template-v2.contracts";
export declare class CodeGenTemplateSerializerV2 {
    serializeAst(ast: CodeGenTemplateDocumentNode): string;
    deserializeAst(value: string): CodeGenTemplateDocumentNode;
    serializeResult(result: CodeGenTemplateCompileResult): string;
}
//# sourceMappingURL=codegen-template-serializer-v2.d.ts.map