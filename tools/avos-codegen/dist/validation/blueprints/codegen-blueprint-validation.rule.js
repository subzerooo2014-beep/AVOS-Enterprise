"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintValidationRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenBlueprintValidationRule {
    descriptor = {
        key: "blueprint-validation",
        name: "Blueprint Validation",
        description: "Validates blueprint identity and template bindings",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.BLUEPRINT,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR,
        enabled: true,
        priority: 10,
        capabilities: [
            "blueprint-key-validation",
            "template-binding-validation",
        ],
    };
    validate(context) {
        const issues = [];
        if (context.blueprintKey !==
            undefined &&
            !context.blueprintKey.trim()) {
            issues.push({
                code: "BLUEPRINT_KEY_EMPTY",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: "Blueprint key cannot be empty",
                path: "blueprintKey",
            });
        }
        const duplicates = context.templateKeys
            .filter((key, index, values) => values.indexOf(key) !==
            index);
        for (const duplicate of Array.from(new Set(duplicates))) {
            issues.push({
                code: "DUPLICATE_TEMPLATE_KEY",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: `Duplicate template key: ${duplicate}`,
                path: "templateKeys",
            });
        }
        return {
            ruleKey: this.descriptor.key,
            valid: issues.length === 0,
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenBlueprintValidationRule = CodeGenBlueprintValidationRule;
//# sourceMappingURL=codegen-blueprint-validation.rule.js.map