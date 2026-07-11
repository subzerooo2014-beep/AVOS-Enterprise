"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateParserV2 = void 0;
const codegen_template_v2_contracts_1 = require("../contracts/codegen-template-v2.contracts");
class CodeGenTemplateParserV2 {
    parse(tokens) {
        const root = {
            type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.DOCUMENT,
            start: tokens[0]?.start ??
                0,
            end: tokens[tokens.length - 1]?.end ??
                0,
            children: [],
        };
        const stack = [
            {
                kind: "document",
                children: root.children,
            },
        ];
        const current = () => stack[stack.length - 1];
        for (const token of tokens) {
            switch (token.type) {
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.TEXT:
                    current().children.push({
                        type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.TEXT,
                        value: token.raw,
                        start: token.start,
                        end: token.end,
                    });
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.INTERPOLATION:
                    current().children.push({
                        type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.INTERPOLATION,
                        expression: token.expression ??
                            "",
                        start: token.start,
                        end: token.end,
                    });
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.COMMENT:
                    current().children.push({
                        type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.COMMENT,
                        value: token.expression ??
                            "",
                        start: token.start,
                        end: token.end,
                    });
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_OPEN: {
                    const node = {
                        type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.IF,
                        expression: token.expression ??
                            "",
                        children: [],
                        start: token.start,
                        end: token.end,
                    };
                    current().children.push(node);
                    stack.push({
                        kind: "if",
                        children: node.children,
                        node,
                    });
                    break;
                }
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_OPEN: {
                    const parsed = this.parseEachExpression(token.expression ??
                        "");
                    const node = {
                        type: codegen_template_v2_contracts_1.CodeGenTemplateAstNodeType.EACH,
                        expression: parsed.expression,
                        alias: parsed.alias,
                        children: [],
                        start: token.start,
                        end: token.end,
                    };
                    current().children.push(node);
                    stack.push({
                        kind: "each",
                        children: node.children,
                        node,
                    });
                    break;
                }
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_CLOSE:
                    this.closeFrame(stack, "if", token.end);
                    break;
                case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_CLOSE:
                    this.closeFrame(stack, "each", token.end);
                    break;
            }
        }
        if (stack.length > 1) {
            const open = stack[stack.length - 1];
            throw new Error(`Unclosed template block: ${open.kind}`);
        }
        return root;
    }
    closeFrame(stack, expected, end) {
        if (stack.length <= 1) {
            throw new Error(`Unexpected closing block: ${expected}`);
        }
        const frame = stack.pop();
        if (frame.kind !== expected) {
            throw new Error(`Mismatched closing block. Expected ${frame.kind}, received ${expected}`);
        }
        if (frame.node) {
            frame.node.end =
                end;
        }
    }
    parseEachExpression(value) {
        const match = value.match(/^(.+?)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/);
        if (!match) {
            return {
                expression: value.trim(),
                alias: "item",
            };
        }
        return {
            expression: (match[1] ??
                "").trim(),
            alias: (match[2] ??
                "item").trim(),
        };
    }
}
exports.CodeGenTemplateParserV2 = CodeGenTemplateParserV2;
//# sourceMappingURL=codegen-template-parser-v2.js.map