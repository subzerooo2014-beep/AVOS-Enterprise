import {
  createHash,
} from "node:crypto";
import {
  CodeGenCompiledTemplate,
  CodeGenTemplateToken,
  CodeGenTemplateTokenType,
} from "../codegen-template.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";

export interface CompileCodeGenTemplateInput {
  key: string;
  source: string;
}

export class CodeGenTemplateCompiler {
  compile(
    input: CompileCodeGenTemplateInput,
  ): CodeGenCompiledTemplate {
    const key = input.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Compiled template key is required",
      );
    }

    const tokens =
      this.tokenize(input.source);

    const referencedVariables =
      Array.from(
        new Set(
          tokens
            .filter((token) =>
              [
                CodeGenTemplateTokenType.VARIABLE,
                CodeGenTemplateTokenType.RAW_VARIABLE,
                CodeGenTemplateTokenType.HELPER,
                CodeGenTemplateTokenType.IF_OPEN,
                CodeGenTemplateTokenType.UNLESS_OPEN,
                CodeGenTemplateTokenType.EACH_OPEN,
              ].includes(token.type),
            )
            .map((token) =>
              this.extractReferencedVariable(
                token,
              ),
            )
            .filter(
              (value): value is string =>
                Boolean(value),
            ),
        ),
      ).sort();

    const referencedPartials =
      Array.from(
        new Set(
          tokens
            .filter(
              (token) =>
                token.type ===
                CodeGenTemplateTokenType.PARTIAL,
            )
            .map((token) =>
              token.expression.trim(),
            )
            .filter(Boolean),
        ),
      ).sort();

    this.validateBlockBalance(tokens);

    return {
      key,
      source: input.source,
      checksum:
        createHash("sha256")
          .update(input.source)
          .digest("hex"),
      tokens,
      referencedVariables,
      referencedPartials,
      compiledAt:
        new Date().toISOString(),
    };
  }

  checksum(source: string): string {
    return createHash("sha256")
      .update(source)
      .digest("hex");
  }

  private tokenize(
    source: string,
  ): CodeGenTemplateToken[] {
    const tokens:
      CodeGenTemplateToken[] = [];

    const pattern =
      /{{{[\s\S]*?}}}|{{[\s\S]*?}}/g;

    let cursor = 0;
    let match:
      RegExpExecArray | null;

    while (
      (match = pattern.exec(source)) !==
      null
    ) {
      if (match.index > cursor) {
        tokens.push(
          this.createToken(
            CodeGenTemplateTokenType.TEXT,
            source.slice(
              cursor,
              match.index,
            ),
            "",
            cursor,
            match.index,
            source,
          ),
        );
      }

      const raw = match[0];
      const triple =
        raw.startsWith("{{{");

      const expression = raw
        .slice(
          triple ? 3 : 2,
          triple ? -3 : -2,
        )
        .trim();

      tokens.push(
        this.createToken(
          this.resolveTokenType(
            expression,
            triple,
          ),
          raw,
          expression,
          match.index,
          match.index + raw.length,
          source,
        ),
      );

      cursor =
        match.index + raw.length;
    }

    if (cursor < source.length) {
      tokens.push(
        this.createToken(
          CodeGenTemplateTokenType.TEXT,
          source.slice(cursor),
          "",
          cursor,
          source.length,
          source,
        ),
      );
    }

    return tokens;
  }

  private resolveTokenType(
    expression: string,
    triple: boolean,
  ): CodeGenTemplateTokenType {
    if (triple) {
      return CodeGenTemplateTokenType.RAW_VARIABLE;
    }

    if (expression === "else") {
      return CodeGenTemplateTokenType.ELSE;
    }

    if (expression.startsWith("#if ")) {
      return CodeGenTemplateTokenType.IF_OPEN;
    }

    if (
      expression.startsWith("#unless ")
    ) {
      return CodeGenTemplateTokenType.UNLESS_OPEN;
    }

    if (
      expression.startsWith("#each ")
    ) {
      return CodeGenTemplateTokenType.EACH_OPEN;
    }

    if (expression.startsWith("/")) {
      return CodeGenTemplateTokenType.BLOCK_CLOSE;
    }

    if (expression.startsWith(">")) {
      return CodeGenTemplateTokenType.PARTIAL;
    }

    const parts =
      this.splitExpression(expression);

    if (parts.length > 1) {
      return CodeGenTemplateTokenType.HELPER;
    }

    return CodeGenTemplateTokenType.VARIABLE;
  }

  private createToken(
    type: CodeGenTemplateTokenType,
    value: string,
    expression: string,
    start: number,
    end: number,
    source: string,
  ): CodeGenTemplateToken {
    const before =
      source.slice(0, start);

    const lines =
      before.split(/\r?\n/);

    return {
      type,
      value,
      expression,
      position: {
        start,
        end,
        line: lines.length,
        column:
          lines[lines.length - 1]!
            .length + 1,
      },
    };
  }

  private validateBlockBalance(
    tokens: CodeGenTemplateToken[],
  ): void {
    const stack: string[] = [];

    for (const token of tokens) {
      if (
        token.type ===
          CodeGenTemplateTokenType.IF_OPEN ||
        token.type ===
          CodeGenTemplateTokenType.UNLESS_OPEN ||
        token.type ===
          CodeGenTemplateTokenType.EACH_OPEN
      ) {
        const block =
          token.expression
            .slice(1)
            .split(/\s+/)[0];

        stack.push(block ?? "");
      }

      if (
        token.type ===
        CodeGenTemplateTokenType.BLOCK_CLOSE
      ) {
        const expected =
          stack.pop();

        const actual =
          token.expression.slice(1).trim();

        if (!expected) {
          throw new CodeGenValidationError(
            `Unexpected template block close: ${actual} at line ${token.position.line}`,
          );
        }

        if (actual !== expected) {
          throw new CodeGenValidationError(
            `Template block mismatch. Expected /${expected} but found /${actual} at line ${token.position.line}`,
          );
        }
      }
    }

    if (stack.length > 0) {
      throw new CodeGenValidationError(
        `Unclosed template block: ${stack[stack.length - 1]}`,
      );
    }
  }

  private extractReferencedVariable(
    token: CodeGenTemplateToken,
  ): string | undefined {
    const expression =
      token.expression
        .replace(/^#(?:if|unless|each)\s+/, "")
        .trim();

    const parts =
      this.splitExpression(expression);

    if (
      token.type ===
      CodeGenTemplateTokenType.HELPER
    ) {
      return parts[1];
    }

    return parts[0];
  }

  private splitExpression(
    expression: string,
  ): string[] {
    return expression
      .match(
        /(?:[^\s"']+|"[^"]*"|'[^']*')+/g,
      )
      ?.map((part) =>
        part.replace(
          /^["']|["']$/g,
          "",
        ),
      ) ?? [];
  }
}
