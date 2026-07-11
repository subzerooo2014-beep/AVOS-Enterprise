"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateRenderer = void 0;
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_template_contracts_1 = require("../codegen-template.contracts");
const codegen_template_compiler_1 = require("./codegen-template-compiler");
const codegen_template_helper_registry_1 = require("./codegen-template-helper-registry");
const codegen_template_value_utilities_1 = require("../utilities/codegen-template-value.utilities");
class CodeGenTemplateRenderer {
    compiler;
    helpers;
    constructor(compiler = new codegen_template_compiler_1.CodeGenTemplateCompiler(), helpers = new codegen_template_helper_registry_1.CodeGenTemplateHelperRegistry()) {
        this.compiler = compiler;
        this.helpers = helpers;
    }
    render(compiled, context) {
        const diagnostics = {
            missingVariables: [],
            usedVariables: [],
            usedPartials: [],
            warnings: [],
        };
        const state = {
            context,
            variables: structuredClone(context.variables),
            diagnostics,
            partialStack: [],
        };
        const result = this.renderTokens(compiled.tokens, 0, state);
        return {
            content: result.content,
            diagnostics: {
                missingVariables: Array.from(new Set(diagnostics.missingVariables)).sort(),
                usedVariables: Array.from(new Set(diagnostics.usedVariables)).sort(),
                usedPartials: Array.from(new Set(diagnostics.usedPartials)).sort(),
                warnings: Array.from(new Set(diagnostics.warnings)),
            },
        };
    }
    renderString(key, source, context) {
        const compiled = this.compiler.compile({
            key,
            source,
        });
        return this.render(compiled, context).content;
    }
    renderTokens(tokens, startIndex, state) {
        let content = "";
        let index = startIndex;
        while (index < tokens.length) {
            const token = tokens[index];
            switch (token.type) {
                case codegen_template_contracts_1.CodeGenTemplateTokenType.TEXT:
                    content += token.value;
                    index += 1;
                    break;
                case codegen_template_contracts_1.CodeGenTemplateTokenType.VARIABLE:
                    content += this.renderVariable(token.expression, state, true);
                    index += 1;
                    break;
                case codegen_template_contracts_1.CodeGenTemplateTokenType.RAW_VARIABLE:
                    content += this.renderVariable(token.expression, state, false);
                    index += 1;
                    break;
                case codegen_template_contracts_1.CodeGenTemplateTokenType.HELPER:
                    content += this.renderHelper(token.expression, state);
                    index += 1;
                    break;
                case codegen_template_contracts_1.CodeGenTemplateTokenType.PARTIAL:
                    content += this.renderPartial(token.expression, state);
                    index += 1;
                    break;
                case codegen_template_contracts_1.CodeGenTemplateTokenType.IF_OPEN:
                case codegen_template_contracts_1.CodeGenTemplateTokenType.UNLESS_OPEN: {
                    const conditionPath = token.expression
                        .replace(/^#(?:if|unless)\s+/, "")
                        .trim();
                    const conditionValue = this.resolveValue(conditionPath, state);
                    const condition = (0, codegen_template_value_utilities_1.isTruthyTemplateValue)(conditionValue);
                    const block = this.renderTokens(tokens, index + 1, state);
                    let truthyContent = block.content;
                    let falseContent = "";
                    let nextIndex = block.nextIndex;
                    if (block.terminator === "else") {
                        const falseBlock = this.renderTokens(tokens, block.nextIndex, state);
                        falseContent =
                            falseBlock.content;
                        nextIndex =
                            falseBlock.nextIndex;
                    }
                    const shouldRender = token.type ===
                        codegen_template_contracts_1.CodeGenTemplateTokenType.IF_OPEN
                        ? condition
                        : !condition;
                    content += shouldRender
                        ? truthyContent
                        : falseContent;
                    index = nextIndex;
                    break;
                }
                case codegen_template_contracts_1.CodeGenTemplateTokenType.EACH_OPEN: {
                    const collectionPath = token.expression
                        .replace(/^#each\s+/, "")
                        .trim();
                    const collection = this.resolveValue(collectionPath, state);
                    const blockStart = index + 1;
                    const blockProbe = this.renderTokens(tokens, blockStart, {
                        ...state,
                        variables: {
                            ...state.variables,
                            this: null,
                        },
                    });
                    const blockEnd = blockProbe.nextIndex;
                    if (Array.isArray(collection)) {
                        collection.forEach((item, itemIndex) => {
                            const childState = {
                                ...state,
                                variables: {
                                    ...state.variables,
                                    this: item,
                                    "@index": itemIndex,
                                    "@first": itemIndex === 0,
                                    "@last": itemIndex ===
                                        collection.length - 1,
                                },
                            };
                            const rendered = this.renderTokens(tokens, blockStart, childState);
                            content +=
                                rendered.content;
                        });
                    }
                    index = blockEnd;
                    break;
                }
                case codegen_template_contracts_1.CodeGenTemplateTokenType.ELSE:
                    return {
                        content,
                        nextIndex: index + 1,
                        terminator: "else",
                    };
                case codegen_template_contracts_1.CodeGenTemplateTokenType.BLOCK_CLOSE:
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
    renderVariable(expression, state, escaped) {
        const value = this.resolveValue(expression, state);
        const rendered = (0, codegen_template_value_utilities_1.stringifyTemplateValue)(value);
        return escaped
            ? (0, codegen_template_value_utilities_1.escapeHtml)(rendered)
            : rendered;
    }
    renderHelper(expression, state) {
        const parts = this.splitExpression(expression);
        const helperKey = parts.shift();
        const variablePath = parts.shift();
        if (!helperKey ||
            !variablePath) {
            throw new codegen_errors_1.CodeGenValidationError(`Invalid template helper expression: ${expression}`);
        }
        const value = this.resolveValue(variablePath, state);
        return this.helpers.execute(helperKey, value, parts);
    }
    renderPartial(expression, state) {
        const partialKey = expression
            .replace(/^>\s*/, "")
            .trim();
        if (!partialKey) {
            throw new codegen_errors_1.CodeGenValidationError("Template partial key is required");
        }
        const partialSource = state.context.partials?.[partialKey];
        if (partialSource === undefined) {
            if (state.context.strict) {
                throw new codegen_errors_1.CodeGenValidationError(`Template partial was not found: ${partialKey}`);
            }
            state.diagnostics.warnings.push(`Template partial was not found: ${partialKey}`);
            return "";
        }
        if (state.partialStack.includes(partialKey)) {
            throw new codegen_errors_1.CodeGenValidationError(`Circular template partial detected: ${[
                ...state.partialStack,
                partialKey,
            ].join(" -> ")}`);
        }
        state.diagnostics.usedPartials.push(partialKey);
        const compiled = this.compiler.compile({
            key: `partial:${partialKey}`,
            source: partialSource,
        });
        const rendered = this.renderTokens(compiled.tokens, 0, {
            ...state,
            partialStack: [
                ...state.partialStack,
                partialKey,
            ],
        });
        return rendered.content;
    }
    resolveValue(path, state) {
        const normalizedPath = path.trim();
        const value = (0, codegen_template_value_utilities_1.resolveTemplateValue)(state.variables, normalizedPath);
        if (value === undefined) {
            state.diagnostics
                .missingVariables
                .push(normalizedPath);
            if (state.context.strict) {
                throw new codegen_errors_1.CodeGenValidationError(`Template variable was not found: ${normalizedPath}`);
            }
            return undefined;
        }
        state.diagnostics
            .usedVariables
            .push(normalizedPath);
        return value;
    }
    splitExpression(expression) {
        return expression
            .match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)
            ?.map((part) => part.replace(/^["']|["']$/g, "")) ?? [];
    }
}
exports.CodeGenTemplateRenderer = CodeGenTemplateRenderer;
//# sourceMappingURL=codegen-template-renderer.js.map