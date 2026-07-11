import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenCompiledTemplate,
  CodeGenTemplateRenderContext,
  CodeGenTemplateRenderDiagnostics,
  CodeGenTemplateToken,
  CodeGenTemplateTokenType,
} from "../codegen-template.contracts";
import {
  CodeGenTemplateCompiler,
} from "./codegen-template-compiler";
import {
  CodeGenTemplateHelperRegistry,
} from "./codegen-template-helper-registry";
import {
  escapeHtml,
  isTruthyTemplateValue,
  resolveTemplateValue,
  stringifyTemplateValue,
} from "../utilities/codegen-template-value.utilities";

interface RenderBlockResult {
  content: string;
  nextIndex: number;
  terminator?: "else" | "close";
}

interface RenderState {
  context: CodeGenTemplateRenderContext;
  variables: Record<string, CodeGenJsonValue>;
  diagnostics: CodeGenTemplateRenderDiagnostics;
  partialStack: string[];
}

export class CodeGenTemplateRenderer {
  constructor(
    readonly compiler =
      new CodeGenTemplateCompiler(),
    readonly helpers =
      new CodeGenTemplateHelperRegistry(),
  ) {}

  render(
    compiled: CodeGenCompiledTemplate,
    context: CodeGenTemplateRenderContext,
  ): {
    content: string;
    diagnostics:
      CodeGenTemplateRenderDiagnostics;
  } {
    const diagnostics:
      CodeGenTemplateRenderDiagnostics = {
      missingVariables: [],
      usedVariables: [],
      usedPartials: [],
      warnings: [],
    };

    const state: RenderState = {
      context,
      variables:
        structuredClone(
          context.variables,
        ),
      diagnostics,
      partialStack: [],
    };

    const result =
      this.renderTokens(
        compiled.tokens,
        0,
        state,
      );

    return {
      content: result.content,
      diagnostics: {
        missingVariables:
          Array.from(
            new Set(
              diagnostics.missingVariables,
            ),
          ).sort(),
        usedVariables:
          Array.from(
            new Set(
              diagnostics.usedVariables,
            ),
          ).sort(),
        usedPartials:
          Array.from(
            new Set(
              diagnostics.usedPartials,
            ),
          ).sort(),
        warnings:
          Array.from(
            new Set(
              diagnostics.warnings,
            ),
          ),
      },
    };
  }

  renderString(
    key: string,
    source: string,
    context: CodeGenTemplateRenderContext,
  ): string {
    const compiled =
      this.compiler.compile({
        key,
        source,
      });

    return this.render(
      compiled,
      context,
    ).content;
  }

  private renderTokens(
    tokens: CodeGenTemplateToken[],
    startIndex: number,
    state: RenderState,
  ): RenderBlockResult {
    let content = "";
    let index = startIndex;

    while (index < tokens.length) {
      const token = tokens[index]!;

      switch (token.type) {
        case CodeGenTemplateTokenType.TEXT:
          content += token.value;
          index += 1;
          break;

        case CodeGenTemplateTokenType.VARIABLE:
          content += this.renderVariable(
            token.expression,
            state,
            true,
          );
          index += 1;
          break;

        case CodeGenTemplateTokenType.RAW_VARIABLE:
          content += this.renderVariable(
            token.expression,
            state,
            false,
          );
          index += 1;
          break;

        case CodeGenTemplateTokenType.HELPER:
          content += this.renderHelper(
            token.expression,
            state,
          );
          index += 1;
          break;

        case CodeGenTemplateTokenType.PARTIAL:
          content += this.renderPartial(
            token.expression,
            state,
          );
          index += 1;
          break;

        case CodeGenTemplateTokenType.IF_OPEN:
        case CodeGenTemplateTokenType.UNLESS_OPEN: {
          const conditionPath =
            token.expression
              .replace(
                /^#(?:if|unless)\s+/,
                "",
              )
              .trim();

          const conditionValue =
            this.resolveValue(
              conditionPath,
              state,
            );

          const condition =
            isTruthyTemplateValue(
              conditionValue,
            );

          const block =
            this.renderTokens(
              tokens,
              index + 1,
              state,
            );

          let truthyContent =
            block.content;

          let falseContent = "";
          let nextIndex =
            block.nextIndex;

          if (
            block.terminator === "else"
          ) {
            const falseBlock =
              this.renderTokens(
                tokens,
                block.nextIndex,
                state,
              );

            falseContent =
              falseBlock.content;

            nextIndex =
              falseBlock.nextIndex;
          }

          const shouldRender =
            token.type ===
            CodeGenTemplateTokenType.IF_OPEN
              ? condition
              : !condition;

          content += shouldRender
            ? truthyContent
            : falseContent;

          index = nextIndex;
          break;
        }

        case CodeGenTemplateTokenType.EACH_OPEN: {
          const collectionPath =
            token.expression
              .replace(/^#each\s+/, "")
              .trim();

          const collection =
            this.resolveValue(
              collectionPath,
              state,
            );

          const blockStart =
            index + 1;

          const blockProbe =
            this.renderTokens(
              tokens,
              blockStart,
              {
                ...state,
                variables: {
                  ...state.variables,
                  this: null,
                },
              },
            );

          const blockEnd =
            blockProbe.nextIndex;

          if (Array.isArray(collection)) {
            collection.forEach(
              (item, itemIndex) => {
                const childState:
                  RenderState = {
                  ...state,
                  variables: {
                    ...state.variables,
                    this: item,
                    "@index": itemIndex,
                    "@first":
                      itemIndex === 0,
                    "@last":
                      itemIndex ===
                      collection.length - 1,
                  },
                };

                const rendered =
                  this.renderTokens(
                    tokens,
                    blockStart,
                    childState,
                  );

                content +=
                  rendered.content;
              },
            );
          }

          index = blockEnd;
          break;
        }

        case CodeGenTemplateTokenType.ELSE:
          return {
            content,
            nextIndex: index + 1,
            terminator: "else",
          };

        case CodeGenTemplateTokenType.BLOCK_CLOSE:
          return {
            content,
            nextIndex: index + 1,
            terminator: "close",
          };

        default:
          index += 1;
          break;
      }
    }

    return {
      content,
      nextIndex: index,
    };
  }

  private renderVariable(
    expression: string,
    state: RenderState,
    escaped: boolean,
  ): string {
    const value =
      this.resolveValue(
        expression,
        state,
      );

    const rendered =
      stringifyTemplateValue(value);

    return escaped
      ? escapeHtml(rendered)
      : rendered;
  }

  private renderHelper(
    expression: string,
    state: RenderState,
  ): string {
    const parts =
      this.splitExpression(expression);

    const helperKey =
      parts.shift();

    const variablePath =
      parts.shift();

    if (
      !helperKey ||
      !variablePath
    ) {
      throw new CodeGenValidationError(
        `Invalid template helper expression: ${expression}`,
      );
    }

    const value =
      this.resolveValue(
        variablePath,
        state,
      );

    return this.helpers.execute(
      helperKey,
      value,
      parts,
    );
  }

  private renderPartial(
    expression: string,
    state: RenderState,
  ): string {
    const partialKey =
      expression
        .replace(/^>\s*/, "")
        .trim();

    if (!partialKey) {
      throw new CodeGenValidationError(
        "Template partial key is required",
      );
    }

    const partialSource =
      state.context.partials?.[
        partialKey
      ];

    if (partialSource === undefined) {
      if (state.context.strict) {
        throw new CodeGenValidationError(
          `Template partial was not found: ${partialKey}`,
        );
      }

      state.diagnostics.warnings.push(
        `Template partial was not found: ${partialKey}`,
      );

      return "";
    }

    if (
      state.partialStack.includes(
        partialKey,
      )
    ) {
      throw new CodeGenValidationError(
        `Circular template partial detected: ${[
          ...state.partialStack,
          partialKey,
        ].join(" -> ")}`,
      );
    }

    state.diagnostics.usedPartials.push(
      partialKey,
    );

    const compiled =
      this.compiler.compile({
        key: `partial:${partialKey}`,
        source: partialSource,
      });

    const rendered =
      this.renderTokens(
        compiled.tokens,
        0,
        {
          ...state,
          partialStack: [
            ...state.partialStack,
            partialKey,
          ],
        },
      );

    return rendered.content;
  }

  private resolveValue(
    path: string,
    state: RenderState,
  ): CodeGenJsonValue | undefined {
    const normalizedPath =
      path.trim();

    const value =
      resolveTemplateValue(
        state.variables,
        normalizedPath,
      );

    if (value === undefined) {
      state.diagnostics
        .missingVariables
        .push(normalizedPath);

      if (state.context.strict) {
        throw new CodeGenValidationError(
          `Template variable was not found: ${normalizedPath}`,
        );
      }

      return undefined;
    }

    state.diagnostics
      .usedVariables
      .push(normalizedPath);

    return value;
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
