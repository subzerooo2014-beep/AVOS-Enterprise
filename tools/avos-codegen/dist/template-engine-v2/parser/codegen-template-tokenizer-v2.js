"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateTokenizerV2 = void 0;
const codegen_template_v2_contracts_1 = require("../contracts/codegen-template-v2.contracts");
class CodeGenTemplateTokenizerV2 {
    tokenize(source) {
        const tokens = [];
        let cursor = 0;
        let line = 1;
        let column = 1;
        const pushText = (start, end, startLine, startColumn) => {
            if (end <= start) {
                return;
            }
            tokens.push({
                type: codegen_template_v2_contracts_1.CodeGenTemplateTokenType.TEXT,
                raw: source.slice(start, end),
                start,
                end,
                line: startLine,
                column: startColumn,
            });
        };
        while (cursor <
            source.length) {
            const open = source.indexOf("{{", cursor);
            if (open < 0) {
                pushText(cursor, source.length, line, column);
                break;
            }
            if (open > cursor) {
                const text = source.slice(cursor, open);
                pushText(cursor, open, line, column);
                const advanced = this.advance(text, line, column);
                line =
                    advanced.line;
                column =
                    advanced.column;
            }
            const close = source.indexOf("}}", open + 2);
            if (close < 0) {
                const remainder = source.slice(open);
                pushText(open, source.length, line, column);
                const advanced = this.advance(remainder, line, column);
                line =
                    advanced.line;
                column =
                    advanced.column;
                break;
            }
            const raw = source.slice(open, close + 2);
            const expression = source
                .slice(open + 2, close)
                .trim();
            const type = this.resolveType(expression);
            tokens.push({
                type,
                raw,
                expression: this.cleanExpression(expression, type),
                start: open,
                end: close + 2,
                line,
                column,
            });
            const advanced = this.advance(raw, line, column);
            line =
                advanced.line;
            column =
                advanced.column;
            cursor =
                close + 2;
        }
        return tokens;
    }
    resolveType(expression) {
        if (expression.startsWith("!")) {
            return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.COMMENT;
        }
        if (expression.startsWith("#if ")) {
            return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_OPEN;
        }
        if (expression === "/if") {
            return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_CLOSE;
        }
        if (expression.startsWith("#each ")) {
            return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_OPEN;
        }
        if (expression === "/each") {
            return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_CLOSE;
        }
        return codegen_template_v2_contracts_1.CodeGenTemplateTokenType.INTERPOLATION;
    }
    cleanExpression(expression, type) {
        switch (type) {
            case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.COMMENT:
                return expression
                    .slice(1)
                    .trim();
            case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_OPEN:
                return expression
                    .slice(4)
                    .trim();
            case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_OPEN:
                return expression
                    .slice(6)
                    .trim();
            case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_CLOSE:
            case codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_CLOSE:
                return "";
            default:
                return expression;
        }
    }
    advance(value, currentLine, currentColumn) {
        let line = currentLine;
        let column = currentColumn;
        for (const character of value) {
            if (character === "\n") {
                line += 1;
                column = 1;
            }
            else {
                column += 1;
            }
        }
        return {
            line,
            column,
        };
    }
}
exports.CodeGenTemplateTokenizerV2 = CodeGenTemplateTokenizerV2;
//# sourceMappingURL=codegen-template-tokenizer-v2.js.map