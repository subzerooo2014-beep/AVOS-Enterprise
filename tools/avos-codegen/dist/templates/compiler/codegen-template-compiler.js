"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateCompiler = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_template_contracts_1 = require("../codegen-template.contracts");
const codegen_errors_1 = require("../../core/codegen.errors");
class CodeGenTemplateCompiler {
    compile(input) {
        const key = input.key.trim();
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Compiled template key is required");
        }
        const tokens = this.tokenize(input.source);
        const referencedVariables = Array.from(new Set(tokens
            .filter((token) => [
            codegen_template_contracts_1.CodeGenTemplateTokenType.VARIABLE,
            codegen_template_contracts_1.CodeGenTemplateTokenType.RAW_VARIABLE,
            codegen_template_contracts_1.CodeGenTemplateTokenType.HELPER,
            codegen_template_contracts_1.CodeGenTemplateTokenType.IF_OPEN,
            codegen_template_contracts_1.CodeGenTemplateTokenType.UNLESS_OPEN,
            codegen_template_contracts_1.CodeGenTemplateTokenType.EACH_OPEN,
        ].includes(token.type))
            .map((token) => this.extractReferencedVariable(token))
            .filter((value) => Boolean(value)))).sort();
        const referencedPartials = Array.from(new Set(tokens
            .filter((token) => token.type ===
            codegen_template_contracts_1.CodeGenTemplateTokenType.PARTIAL)
            .map((token) => token.expression.trim())
            .filter(Boolean))).sort();
        this.validateBlockBalance(tokens);
        return {
            key,
            source: input.source,
            checksum: (0, node_crypto_1.createHash)("sha256")
                .update(input.source)
                .digest("hex"),
            tokens,
            referencedVariables,
            referencedPartials,
            compiledAt: new Date().toISOString(),
        };
    }
    checksum(source) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(source)
            .digest("hex");
    }
    tokenize(source) {
        const tokens = [];
        const pattern = /{{{[\s\S]*?}}}|{{[\s\S]*?}}/g;
        let cursor = 0;
        let match;
        while ((match = pattern.exec(source)) !==
            null) {
            if (match.index > cursor) {
                tokens.push(this.createToken(codegen_template_contracts_1.CodeGenTemplateTokenType.TEXT, source.slice(cursor, match.index), "", cursor, match.index, source));
            }
            const raw = match[0];
            const triple = raw.startsWith("{{{");
            const expression = raw
                .slice(triple ? 3 : 2, triple ? -3 : -2)
                .trim();
            tokens.push(this.createToken(this.resolveTokenType(expression, triple), raw, expression, match.index, match.index + raw.length, source));
            cursor =
                match.index + raw.length;
        }
        if (cursor < source.length) {
            tokens.push(this.createToken(codegen_template_contracts_1.CodeGenTemplateTokenType.TEXT, source.slice(cursor), "", cursor, source.length, source));
        }
        return tokens;
    }
    resolveTokenType(expression, triple) {
        if (triple) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.RAW_VARIABLE;
        }
        if (expression === "else") {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.ELSE;
        }
        if (expression.startsWith("#if ")) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.IF_OPEN;
        }
        if (expression.startsWith("#unless ")) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.UNLESS_OPEN;
        }
        if (expression.startsWith("#each ")) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.EACH_OPEN;
        }
        if (expression.startsWith("/")) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.BLOCK_CLOSE;
        }
        if (expression.startsWith(">")) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.PARTIAL;
        }
        const parts = this.splitExpression(expression);
        if (parts.length > 1) {
            return codegen_template_contracts_1.CodeGenTemplateTokenType.HELPER;
        }
        return codegen_template_contracts_1.CodeGenTemplateTokenType.VARIABLE;
    }
    createToken(type, value, expression, start, end, source) {
        const before = source.slice(0, start);
        const lines = before.split(/\r?\n/);
        return {
            type,
            value,
            expression,
            position: {
                start,
                end,
                line: lines.length,
                column: lines[lines.length - 1]
                    .length + 1,
            },
        };
    }
    validateBlockBalance(tokens) {
        const stack = [];
        for (const token of tokens) {
            if (token.type ===
                codegen_template_contracts_1.CodeGenTemplateTokenType.IF_OPEN ||
                token.type ===
                    codegen_template_contracts_1.CodeGenTemplateTokenType.UNLESS_OPEN ||
                token.type ===
                    codegen_template_contracts_1.CodeGenTemplateTokenType.EACH_OPEN) {
                const block = token.expression
                    .slice(1)
                    .split(/\s+/)[0];
                stack.push(block ?? "");
            }
            if (token.type ===
                codegen_template_contracts_1.CodeGenTemplateTokenType.BLOCK_CLOSE) {
                const expected = stack.pop();
                const actual = token.expression.slice(1).trim();
                if (!expected) {
                    throw new codegen_errors_1.CodeGenValidationError(`Unexpected template block close: ${actual} at line ${token.position.line}`);
                }
                if (actual !== expected) {
                    throw new codegen_errors_1.CodeGenValidationError(`Template block mismatch. Expected /${expected} but found /${actual} at line ${token.position.line}`);
                }
            }
        }
        if (stack.length > 0) {
            throw new codegen_errors_1.CodeGenValidationError(`Unclosed template block: ${stack[stack.length - 1]}`);
        }
    }
    extractReferencedVariable(token) {
        const expression = token.expression
            .replace(/^#(?:if|unless|each)\s+/, "")
            .trim();
        const parts = this.splitExpression(expression);
        if (token.type ===
            codegen_template_contracts_1.CodeGenTemplateTokenType.HELPER) {
            return parts[1];
        }
        return parts[0];
    }
    splitExpression(expression) {
        return expression
            .match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)
            ?.map((part) => part.replace(/^["']|["']$/g, "")) ?? [];
    }
}
exports.CodeGenTemplateCompiler = CodeGenTemplateCompiler;
//# sourceMappingURL=codegen-template-compiler.js.map