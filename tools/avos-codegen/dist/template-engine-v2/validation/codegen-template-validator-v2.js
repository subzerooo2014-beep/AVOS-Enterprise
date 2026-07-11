"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateValidatorV2 = void 0;
const codegen_template_v2_contracts_1 = require("../contracts/codegen-template-v2.contracts");
class CodeGenTemplateValidatorV2 {
    validate(tokens) {
        const diagnostics = [];
        const stack = [];
        for (const token of tokens) {
            if (token.type ===
                codegen_template_v2_contracts_1.CodeGenTemplateTokenType.INTERPOLATION &&
                !token.expression) {
                diagnostics.push({
                    code: "EMPTY_INTERPOLATION",
                    severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                    message: "Interpolation expression cannot be empty",
                    line: token.line,
                    column: token.column,
                });
            }
            if (token.type ===
                codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_OPEN) {
                if (!token.expression) {
                    diagnostics.push({
                        code: "EMPTY_IF_EXPRESSION",
                        severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                        message: "If expression cannot be empty",
                        line: token.line,
                        column: token.column,
                    });
                }
                stack.push({
                    type: "if",
                    token,
                });
            }
            if (token.type ===
                codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_OPEN) {
                if (!token.expression) {
                    diagnostics.push({
                        code: "EMPTY_EACH_EXPRESSION",
                        severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                        message: "Each expression cannot be empty",
                        line: token.line,
                        column: token.column,
                    });
                }
                stack.push({
                    type: "each",
                    token,
                });
            }
            if (token.type ===
                codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_CLOSE ||
                token.type ===
                    codegen_template_v2_contracts_1.CodeGenTemplateTokenType.EACH_CLOSE) {
                const expected = token.type ===
                    codegen_template_v2_contracts_1.CodeGenTemplateTokenType.IF_CLOSE
                    ? "if"
                    : "each";
                const current = stack.pop();
                if (!current) {
                    diagnostics.push({
                        code: "UNEXPECTED_BLOCK_CLOSE",
                        severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                        message: `Unexpected closing block: ${expected}`,
                        line: token.line,
                        column: token.column,
                    });
                    continue;
                }
                if (current.type !==
                    expected) {
                    diagnostics.push({
                        code: "MISMATCHED_BLOCK_CLOSE",
                        severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                        message: `Expected closing block for ${current.type}, received ${expected}`,
                        line: token.line,
                        column: token.column,
                    });
                }
            }
        }
        for (const current of stack) {
            diagnostics.push({
                code: "UNCLOSED_BLOCK",
                severity: codegen_template_v2_contracts_1.CodeGenTemplateDiagnosticSeverity.ERROR,
                message: `Unclosed template block: ${current.type}`,
                line: current.token.line,
                column: current.token.column,
                expression: current.token.expression,
            });
        }
        return diagnostics;
    }
}
exports.CodeGenTemplateValidatorV2 = CodeGenTemplateValidatorV2;
//# sourceMappingURL=codegen-template-validator-v2.js.map