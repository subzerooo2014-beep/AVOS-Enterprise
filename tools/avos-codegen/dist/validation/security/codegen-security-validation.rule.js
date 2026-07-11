"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenSecurityValidationRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenSecurityValidationRule {
    descriptor = {
        key: "security-validation",
        name: "Security Validation",
        description: "Detects unsafe generated code patterns",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.SECURITY,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL,
        enabled: true,
        priority: 50,
        capabilities: [
            "eval-detection",
            "dynamic-function-detection",
            "shell-execution-detection",
            "path-traversal-detection",
        ],
    };
    validate(context) {
        const issues = [];
        const patterns = [
            {
                code: "UNSAFE_EVAL",
                expression: /\beval\s*\(/,
                message: "Generated source contains eval()",
            },
            {
                code: "UNSAFE_DYNAMIC_FUNCTION",
                expression: /new\s+Function\s*\(/,
                message: "Generated source contains dynamic Function constructor",
            },
            {
                code: "UNSAFE_SHELL_EXECUTION",
                expression: /\b(exec|execSync|spawn|spawnSync)\s*\(/,
                message: "Generated source contains shell execution",
            },
        ];
        for (const artifact of context.artifacts) {
            for (const pattern of patterns) {
                if (pattern.expression.test(artifact.content)) {
                    issues.push({
                        code: pattern.code,
                        category: this.descriptor.category,
                        severity: this.descriptor.severity,
                        message: pattern.message,
                        artifactKey: artifact.key,
                        path: artifact.relativePath,
                    });
                }
            }
        }
        return {
            ruleKey: this.descriptor.key,
            valid: issues.length === 0,
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenSecurityValidationRule = CodeGenSecurityValidationRule;
//# sourceMappingURL=codegen-security-validation.rule.js.map