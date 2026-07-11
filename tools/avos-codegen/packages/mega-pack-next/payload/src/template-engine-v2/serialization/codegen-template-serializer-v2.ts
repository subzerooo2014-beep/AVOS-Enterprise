import {
  CodeGenTemplateCompileResult,
  CodeGenTemplateDocumentNode,
} from "../contracts/codegen-template-v2.contracts";

export class CodeGenTemplateSerializerV2 {
  serializeAst(
    ast:
      CodeGenTemplateDocumentNode,
  ): string {
    return JSON.stringify(
      ast,
      null,
      2,
    );
  }

  deserializeAst(
    value: string,
  ): CodeGenTemplateDocumentNode {
    return JSON.parse(
      value,
    ) as
      CodeGenTemplateDocumentNode;
  }

  serializeResult(
    result:
      CodeGenTemplateCompileResult,
  ): string {
    return JSON.stringify(
      result,
      null,
      2,
    );
  }
}
