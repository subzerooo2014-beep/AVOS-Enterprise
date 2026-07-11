import { CodeGenTemplateCompileRequest, CodeGenTemplateCompileResult } from "../contracts/codegen-template-v2.contracts";
import { CodeGenTemplateCacheV2 } from "../cache/codegen-template-cache-v2";
import { CodeGenTemplateParserV2 } from "../parser/codegen-template-parser-v2";
import { CodeGenTemplateTokenizerV2 } from "../parser/codegen-template-tokenizer-v2";
import { CodeGenTemplateRendererV2 } from "../runtime/codegen-template-renderer-v2";
import { CodeGenTemplateValidatorV2 } from "../validation/codegen-template-validator-v2";
export declare class CodeGenTemplateCompilerV2 {
    readonly tokenizer: CodeGenTemplateTokenizerV2;
    readonly parser: CodeGenTemplateParserV2;
    readonly validator: CodeGenTemplateValidatorV2;
    readonly renderer: CodeGenTemplateRendererV2;
    readonly cache: CodeGenTemplateCacheV2;
    constructor(tokenizer?: CodeGenTemplateTokenizerV2, parser?: CodeGenTemplateParserV2, validator?: CodeGenTemplateValidatorV2, renderer?: CodeGenTemplateRendererV2, cache?: CodeGenTemplateCacheV2);
    compile(request: CodeGenTemplateCompileRequest): CodeGenTemplateCompileResult;
}
//# sourceMappingURL=codegen-template-compiler-v2.d.ts.map