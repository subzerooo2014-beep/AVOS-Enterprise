"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateRendererV2 = void 0;
const codegen_template_v2_contracts_1 = require("../contracts/codegen-template-v2.contracts");
const codegen_template_expression_resolver_v2_1 = require("./codegen-template-expression-resolver-v2");
class CodeGenTemplateRendererV2 {
    expressions;
    constructor(expressions = new codegen_template_expression_resolver_v2_1.CodeGenTemplateExpressionResolverV2()) {
        this.expressions = expressions;
    }
    render(document, variables, options) {
        return this.renderNodes(document.children, variables, options);
    }
    renderNodes(nodes, scope, options) {
        let output = "";
        for (const node of nodes) {
            switch (node.type) {
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.TEXT:
                    output +=
                        node.value;
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.INTERPOLATION: {
                    const value = this.expressions.resolve(node.expression, scope);
                    if (value === undefined &&
                        options.strict) {
                        throw new Error(`Template variable was not found: ${node.expression}`);
                    }
                    output +=
                        this.expressions.stringify(value);
                    break;
                }
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.IF: {
                    const value = this.expressions.resolve(node.expression, scope);
                    if (this.expressions.isTruthy(value)) {
                        output +=
                            this.renderNodes(node.children, scope, options);
                    }
                    break;
                }
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.EACH: {
                    const value = this.expressions.resolve(node.expression, scope);
                    if (value === undefined &&
                        options.strict) {
                        throw new Error(`Template collection was not found: ${node.expression}`);
                    }
                    if (!Array.isArray(value)) {
                        break;
                    }
                    value.forEach((item, index) => {
                        output +=
                            this.renderNodes(node.children, {
                                ...scope,
                                [node.alias]: item,
                                $index: index,
                                $first: index === 0,
                                $last: index ===
                                    value.length - 1,
                            }, options);
                    });
                    break;
                }
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.COMMENT:
                    if (options.preserveComments) {
                        output +=
                            `/* ${node.value} */`;
                    }
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.DOCUMENT:
                    output +=
                        this.renderNodes(node.children, scope, options);
                    break;
            }
        }
        return output;
    }
}
exports.CodeGenTemplateRendererV2 = CodeGenTemplateRendererV2;
//# sourceMappingURL=codegen-template-renderer-v2.js.map