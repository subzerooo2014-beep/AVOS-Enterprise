"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenVariableSchemaValidationRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenVariableSchemaValidationRule {
    schema;
    descriptor = {
        key: "variable-schema-validation",
        name: "Variable Schema Validation",
        description: "Validates generation variables against a simple production schema",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.VARIABLES,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR,
        enabled: true,
        priority: 30,
        capabilities: [
            "required-variable-validation",
            "variable-type-validation",
        ],
    };
    constructor(schema = []) {
        this.schema = schema;
    }
    validate(context) {
        const issues = [];
        for (const entry of this.schema) {
            const value = context.variables[entry.key];
            if (entry.required &&
                value === undefined) {
                issues.push({
                    code: "REQUIRED_VARIABLE_MISSING",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: `Required variable is missing: ${entry.key}`,
                    path: `variables.${entry.key}`,
                });
                continue;
            }
            if (value !== undefined &&
                !this.matchesType(value, entry.type)) {
                issues.push({
                    code: "VARIABLE_TYPE_MISMATCH",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: `Variable ${entry.key} must be ${entry.type}`,
                    path: `variables.${entry.key}`,
                });
            }
        }
        return {
            ruleKey: this.descriptor.key,
            valid: issues.length === 0,
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
    matchesType(value, expected) {
        if (expected === "array") {
            return Array.isArray(value);
        }
        if (expected === "object") {
            return Boolean(value &&
                typeof value ===
                    "object" &&
                !Array.isArray(value));
        }
        return typeof value ===
            expected;
    }
}
exports.CodeGenVariableSchemaValidationRule = CodeGenVariableSchemaValidationRule;
//# sourceMappingURL=codegen-variable-schema-validation.rule.js.map