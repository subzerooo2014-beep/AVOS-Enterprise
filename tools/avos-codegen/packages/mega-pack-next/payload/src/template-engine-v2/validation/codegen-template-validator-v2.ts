import {
  CodeGenTemplateDiagnostic,
  CodeGenTemplateDiagnosticSeverity,
  CodeGenTemplateToken,
  CodeGenTemplateTokenType,
} from "../contracts/codegen-template-v2.contracts";

export class CodeGenTemplateValidatorV2 {
  validate(
    tokens:
      readonly CodeGenTemplateToken[],
  ): CodeGenTemplateDiagnostic[] {
    const diagnostics:
      CodeGenTemplateDiagnostic[] =
      [];

    const stack:
      Array<{
        type:
          "if" | "each";
        token:
          CodeGenTemplateToken;
      }> = [];

    for (const token of tokens) {
      if (
        token.type ===
        CodeGenTemplateTokenType.INTERPOLATION &&
        !token.expression
      ) {
        diagnostics.push({
          code:
            "EMPTY_INTERPOLATION",
          severity:
            CodeGenTemplateDiagnosticSeverity.ERROR,
          message:
            "Interpolation expression cannot be empty",
          line:
            token.line,
          column:
            token.column,
        });
      }

      if (
        token.type ===
        CodeGenTemplateTokenType.IF_OPEN
      ) {
        if (!token.expression) {
          diagnostics.push({
            code:
              "EMPTY_IF_EXPRESSION",
            severity:
              CodeGenTemplateDiagnosticSeverity.ERROR,
            message:
              "If expression cannot be empty",
            line:
              token.line,
            column:
              token.column,
          });
        }

        stack.push({
          type:
            "if",
          token,
        });
      }

      if (
        token.type ===
        CodeGenTemplateTokenType.EACH_OPEN
      ) {
        if (!token.expression) {
          diagnostics.push({
            code:
              "EMPTY_EACH_EXPRESSION",
            severity:
              CodeGenTemplateDiagnosticSeverity.ERROR,
            message:
              "Each expression cannot be empty",
            line:
              token.line,
            column:
              token.column,
          });
        }

        stack.push({
          type:
            "each",
          token,
        });
      }

      if (
        token.type ===
          CodeGenTemplateTokenType.IF_CLOSE ||
        token.type ===
          CodeGenTemplateTokenType.EACH_CLOSE
      ) {
        const expected =
          token.type ===
          CodeGenTemplateTokenType.IF_CLOSE
            ? "if"
            : "each";

        const current =
          stack.pop();

        if (!current) {
          diagnostics.push({
            code:
              "UNEXPECTED_BLOCK_CLOSE",
            severity:
              CodeGenTemplateDiagnosticSeverity.ERROR,
            message:
              `Unexpected closing block: ${expected}`,
            line:
              token.line,
            column:
              token.column,
          });
          continue;
        }

        if (
          current.type !==
          expected
        ) {
          diagnostics.push({
            code:
              "MISMATCHED_BLOCK_CLOSE",
            severity:
              CodeGenTemplateDiagnosticSeverity.ERROR,
            message:
              `Expected closing block for ${current.type}, received ${expected}`,
            line:
              token.line,
            column:
              token.column,
          });
        }
      }
    }

    for (const current of stack) {
      diagnostics.push({
        code:
          "UNCLOSED_BLOCK",
        severity:
          CodeGenTemplateDiagnosticSeverity.ERROR,
        message:
          `Unclosed template block: ${current.type}`,
        line:
          current.token.line,
        column:
          current.token.column,
        expression:
          current.token.expression,
      });
    }

    return diagnostics;
  }
}
