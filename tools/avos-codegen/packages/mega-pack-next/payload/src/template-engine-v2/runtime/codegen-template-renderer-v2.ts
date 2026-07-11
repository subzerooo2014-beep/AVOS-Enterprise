import {
  CodeGenTemplateAstNode,
  CodeGenTemplateAstNodeType,
  CodeGenTemplateDocumentNode,
  CodeGenTemplateValue,
} from "../contracts/codegen-template-v2.contracts";
import {
  CodeGenTemplateExpressionResolverV2,
} from "./codegen-template-expression-resolver-v2";

export class CodeGenTemplateRendererV2 {
  constructor(
    readonly expressions =
      new CodeGenTemplateExpressionResolverV2(),
  ) {}

  render(
    document:
      CodeGenTemplateDocumentNode,
    variables:
      Record<
        string,
        CodeGenTemplateValue
      >,
    options: {
      strict: boolean;
      preserveComments: boolean;
    },
  ): string {
    return this.renderNodes(
      document.children,
      variables,
      options,
    );
  }

  private renderNodes(
    nodes:
      readonly CodeGenTemplateAstNode[],
    scope:
      Record<
        string,
        CodeGenTemplateValue
      >,
    options: {
      strict: boolean;
      preserveComments: boolean;
    },
  ): string {
    let output = "";

    for (const node of nodes) {
      switch (node.type) {
        case CodeGenTemplateAstNodeType.TEXT:
          output +=
            node.value;
          break;

        case CodeGenTemplateAstNodeType.INTERPOLATION: {
          const value =
            this.expressions.resolve(
              node.expression,
              scope,
            );

          if (
            value === undefined &&
            options.strict
          ) {
            throw new Error(
              `Template variable was not found: ${node.expression}`,
            );
          }

          output +=
            this.expressions.stringify(
              value,
            );
          break;
        }

        case CodeGenTemplateAstNodeType.IF: {
          const value =
            this.expressions.resolve(
              node.expression,
              scope,
            );

          if (
            this.expressions.isTruthy(
              value,
            )
          ) {
            output +=
              this.renderNodes(
                node.children,
                scope,
                options,
              );
          }
          break;
        }

        case CodeGenTemplateAstNodeType.EACH: {
          const value =
            this.expressions.resolve(
              node.expression,
              scope,
            );

          if (
            value === undefined &&
            options.strict
          ) {
            throw new Error(
              `Template collection was not found: ${node.expression}`,
            );
          }

          if (
            !Array.isArray(
              value,
            )
          ) {
            break;
          }

          value.forEach(
            (
              item,
              index,
            ) => {
              output +=
                this.renderNodes(
                  node.children,
                  {
                    ...scope,
                    [node.alias]:
                      item,
                    $index:
                      index,
                    $first:
                      index === 0,
                    $last:
                      index ===
                      value.length - 1,
                  },
                  options,
                );
            },
          );
          break;
        }

        case CodeGenTemplateAstNodeType.COMMENT:
          if (
            options.preserveComments
          ) {
            output +=
              `/* ${node.value} */`;
          }
          break;

        case CodeGenTemplateAstNodeType.DOCUMENT:
          output +=
            this.renderNodes(
              node.children,
              scope,
              options,
            );
          break;
      }
    }

    return output;
  }
}
