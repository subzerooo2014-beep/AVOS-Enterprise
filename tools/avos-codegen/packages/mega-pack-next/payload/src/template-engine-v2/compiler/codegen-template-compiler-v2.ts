import {
  CodeGenTemplateCompileRequest,
  CodeGenTemplateCompileResult,
  CodeGenTemplateDiagnosticSeverity,
} from "../contracts/codegen-template-v2.contracts";
import {
  CodeGenTemplateCacheV2,
} from "../cache/codegen-template-cache-v2";
import {
  CodeGenTemplateParserV2,
} from "../parser/codegen-template-parser-v2";
import {
  CodeGenTemplateTokenizerV2,
} from "../parser/codegen-template-tokenizer-v2";
import {
  CodeGenTemplateRendererV2,
} from "../runtime/codegen-template-renderer-v2";
import {
  CodeGenTemplateValidatorV2,
} from "../validation/codegen-template-validator-v2";

export class CodeGenTemplateCompilerV2 {
  constructor(
    readonly tokenizer =
      new CodeGenTemplateTokenizerV2(),
    readonly parser =
      new CodeGenTemplateParserV2(),
    readonly validator =
      new CodeGenTemplateValidatorV2(),
    readonly renderer =
      new CodeGenTemplateRendererV2(),
    readonly cache =
      new CodeGenTemplateCacheV2(),
  ) {}

  compile(
    request:
      CodeGenTemplateCompileRequest,
  ): CodeGenTemplateCompileResult {
    const startedAt =
      new Date().toISOString();

    const tokens =
      this.tokenizer.tokenize(
        request.source,
      );

    const diagnostics =
      this.validator.validate(
        tokens,
      );

    const hasErrors =
      diagnostics.some(
        (diagnostic) =>
          diagnostic.severity ===
          CodeGenTemplateDiagnosticSeverity.ERROR,
      );

    let ast =
      this.cache.get(
        request.templateKey,
        request.source,
      );

    if (!ast) {
      ast =
        this.parser.parse(
          tokens,
        );

      this.cache.put(
        request.templateKey,
        request.source,
        ast,
      );
    }

    let output = "";

    if (!hasErrors) {
      try {
        output =
          this.renderer.render(
            ast,
            request.variables,
            {
              strict:
                request.strict,
              preserveComments:
                request.preserveComments,
            },
          );
      } catch (error) {
        diagnostics.push({
          code:
            "TEMPLATE_RENDER_FAILED",
          severity:
            CodeGenTemplateDiagnosticSeverity.ERROR,
          message:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }

    const completedAt =
      new Date().toISOString();

    return {
      success:
        !diagnostics.some(
          (diagnostic) =>
            diagnostic.severity ===
            CodeGenTemplateDiagnosticSeverity.ERROR,
        ),
      templateKey:
        request.templateKey,
      output,
      tokens,
      ast,
      diagnostics,
      startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          startedAt,
        ),
    };
  }
}
