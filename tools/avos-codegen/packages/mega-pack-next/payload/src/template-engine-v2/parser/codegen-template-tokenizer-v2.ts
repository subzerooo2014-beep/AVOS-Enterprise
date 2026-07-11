import {
  CodeGenTemplateToken,
  CodeGenTemplateTokenType,
} from "../contracts/codegen-template-v2.contracts";

export class CodeGenTemplateTokenizerV2 {
  tokenize(
    source: string,
  ): CodeGenTemplateToken[] {
    const tokens:
      CodeGenTemplateToken[] = [];

    let cursor = 0;
    let line = 1;
    let column = 1;

    const pushText = (
      start: number,
      end: number,
      startLine: number,
      startColumn: number,
    ): void => {
      if (end <= start) {
        return;
      }

      tokens.push({
        type:
          CodeGenTemplateTokenType.TEXT,
        raw:
          source.slice(
            start,
            end,
          ),
        start,
        end,
        line:
          startLine,
        column:
          startColumn,
      });
    };

    while (
      cursor <
      source.length
    ) {
      const open =
        source.indexOf(
          "{{",
          cursor,
        );

      if (open < 0) {
        pushText(
          cursor,
          source.length,
          line,
          column,
        );
        break;
      }

      if (open > cursor) {
        const text =
          source.slice(
            cursor,
            open,
          );

        pushText(
          cursor,
          open,
          line,
          column,
        );

        const advanced =
          this.advance(
            text,
            line,
            column,
          );

        line =
          advanced.line;
        column =
          advanced.column;
      }

      const close =
        source.indexOf(
          "}}",
          open + 2,
        );

      if (close < 0) {
        const remainder =
          source.slice(open);

        pushText(
          open,
          source.length,
          line,
          column,
        );

        const advanced =
          this.advance(
            remainder,
            line,
            column,
          );

        line =
          advanced.line;
        column =
          advanced.column;
        break;
      }

      const raw =
        source.slice(
          open,
          close + 2,
        );

      const expression =
        source
          .slice(
            open + 2,
            close,
          )
          .trim();

      const type =
        this.resolveType(
          expression,
        );

      tokens.push({
        type,
        raw,
        expression:
          this.cleanExpression(
            expression,
            type,
          ),
        start:
          open,
        end:
          close + 2,
        line,
        column,
      });

      const advanced =
        this.advance(
          raw,
          line,
          column,
        );

      line =
        advanced.line;
      column =
        advanced.column;
      cursor =
        close + 2;
    }

    return tokens;
  }

  private resolveType(
    expression: string,
  ): CodeGenTemplateTokenType {
    if (
      expression.startsWith(
        "!",
      )
    ) {
      return CodeGenTemplateTokenType.COMMENT;
    }

    if (
      expression.startsWith(
        "#if ",
      )
    ) {
      return CodeGenTemplateTokenType.IF_OPEN;
    }

    if (
      expression === "/if"
    ) {
      return CodeGenTemplateTokenType.IF_CLOSE;
    }

    if (
      expression.startsWith(
        "#each ",
      )
    ) {
      return CodeGenTemplateTokenType.EACH_OPEN;
    }

    if (
      expression === "/each"
    ) {
      return CodeGenTemplateTokenType.EACH_CLOSE;
    }

    return CodeGenTemplateTokenType.INTERPOLATION;
  }

  private cleanExpression(
    expression: string,
    type:
      CodeGenTemplateTokenType,
  ): string {
    switch (type) {
      case CodeGenTemplateTokenType.COMMENT:
        return expression
          .slice(1)
          .trim();

      case CodeGenTemplateTokenType.IF_OPEN:
        return expression
          .slice(4)
          .trim();

      case CodeGenTemplateTokenType.EACH_OPEN:
        return expression
          .slice(6)
          .trim();

      case CodeGenTemplateTokenType.IF_CLOSE:
      case CodeGenTemplateTokenType.EACH_CLOSE:
        return "";

      default:
        return expression;
    }
  }

  private advance(
    value: string,
    currentLine: number,
    currentColumn: number,
  ): {
    line: number;
    column: number;
  } {
    let line =
      currentLine;

    let column =
      currentColumn;

    for (const character of value) {
      if (character === "\n") {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
    }

    return {
      line,
      column,
    };
  }
}
