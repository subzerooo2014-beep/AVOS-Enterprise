import {
  CodeGenTemplateAstNode,
  CodeGenTemplateAstNodeType,
  CodeGenTemplateDocumentNode,
  CodeGenTemplateEachNode,
  CodeGenTemplateIfNode,
  CodeGenTemplateToken,
  CodeGenTemplateTokenType,
} from "../contracts/codegen-template-v2.contracts";

interface CodeGenTemplateParseFrame {
  kind:
    | "document"
    | "if"
    | "each";
  children:
    CodeGenTemplateAstNode[];
  node?:
    CodeGenTemplateIfNode |
    CodeGenTemplateEachNode;
}

export class CodeGenTemplateParserV2 {
  parse(
    tokens:
      readonly CodeGenTemplateToken[],
  ): CodeGenTemplateDocumentNode {
    const root:
      CodeGenTemplateDocumentNode = {
      type:
        CodeGenTemplateAstNodeType.DOCUMENT,
      start:
        tokens[0]?.start ??
        0,
      end:
        tokens[
          tokens.length - 1
        ]?.end ??
        0,
      children: [],
    };

    const stack:
      CodeGenTemplateParseFrame[] = [
        {
          kind:
            "document",
          children:
            root.children,
        },
      ];

    const current = ():
      CodeGenTemplateParseFrame =>
      stack[
        stack.length - 1
      ]!;

    for (const token of tokens) {
      switch (token.type) {
        case CodeGenTemplateTokenType.TEXT:
          current().children.push({
            type:
              CodeGenTemplateAstNodeType.TEXT,
            value:
              token.raw,
            start:
              token.start,
            end:
              token.end,
          });
          break;

        case CodeGenTemplateTokenType.INTERPOLATION:
          current().children.push({
            type:
              CodeGenTemplateAstNodeType.INTERPOLATION,
            expression:
              token.expression ??
              "",
            start:
              token.start,
            end:
              token.end,
          });
          break;

        case CodeGenTemplateTokenType.COMMENT:
          current().children.push({
            type:
              CodeGenTemplateAstNodeType.COMMENT,
            value:
              token.expression ??
              "",
            start:
              token.start,
            end:
              token.end,
          });
          break;

        case CodeGenTemplateTokenType.IF_OPEN: {
          const node:
            CodeGenTemplateIfNode = {
            type:
              CodeGenTemplateAstNodeType.IF,
            expression:
              token.expression ??
              "",
            children: [],
            start:
              token.start,
            end:
              token.end,
          };

          current().children.push(
            node,
          );

          stack.push({
            kind:
              "if",
            children:
              node.children,
            node,
          });
          break;
        }

        case CodeGenTemplateTokenType.EACH_OPEN: {
          const parsed =
            this.parseEachExpression(
              token.expression ??
              "",
            );

          const node:
            CodeGenTemplateEachNode = {
            type:
              CodeGenTemplateAstNodeType.EACH,
            expression:
              parsed.expression,
            alias:
              parsed.alias,
            children: [],
            start:
              token.start,
            end:
              token.end,
          };

          current().children.push(
            node,
          );

          stack.push({
            kind:
              "each",
            children:
              node.children,
            node,
          });
          break;
        }

        case CodeGenTemplateTokenType.IF_CLOSE:
          this.closeFrame(
            stack,
            "if",
            token.end,
          );
          break;

        case CodeGenTemplateTokenType.EACH_CLOSE:
          this.closeFrame(
            stack,
            "each",
            token.end,
          );
          break;
      }
    }

    if (stack.length > 1) {
      const open =
        stack[
          stack.length - 1
        ]!;

      throw new Error(
        `Unclosed template block: ${open.kind}`,
      );
    }

    return root;
  }

  private closeFrame(
    stack:
      CodeGenTemplateParseFrame[],
    expected:
      "if" | "each",
    end: number,
  ): void {
    if (stack.length <= 1) {
      throw new Error(
        `Unexpected closing block: ${expected}`,
      );
    }

    const frame =
      stack.pop()!;

    if (frame.kind !== expected) {
      throw new Error(
        `Mismatched closing block. Expected ${frame.kind}, received ${expected}`,
      );
    }

    if (frame.node) {
      frame.node.end =
        end;
    }
  }

  private parseEachExpression(
    value: string,
  ): {
    expression: string;
    alias: string;
  } {
    const match =
      value.match(
        /^(.+?)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/,
      );

    if (!match) {
      return {
        expression:
          value.trim(),
        alias:
          "item",
      };
    }

    return {
      expression:
        (
          match[1] ??
          ""
        ).trim(),
      alias:
        (
          match[2] ??
          "item"
        ).trim(),
    };
  }
}
