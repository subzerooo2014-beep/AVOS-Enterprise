"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateValidationRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenTemplateValidationRule {
    descriptor = {
        key: "template-validation",
        name: "Template Validation",
        description: "Validates template keys and rendered artifact targets",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.TEMPLATE,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR,
        enabled: true,
        priority: 20,
        capabilities: [
            "template-key-validation",
            "artifact-target-validation",
        ],
    };
    validate(context) {
        const issues = [];
        for (const templateKey of context.templateKeys) {
            if (!templateKey.trim()) {
                issues.push({
                    code: "TEMPLATE_KEY_EMPTY",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: "Template key cannot be empty",
                    path: "templateKeys",
                });
            }
        }
        for (const artifact of context.artifacts) {
            if (!artifact.relativePath.trim()) {
                issues.push({
                    code: "ARTIFACT_TARGET_EMPTY",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: `Artifact target path is empty: ${artifact.key}`,
                    artifactKey: artifact.key,
                });
            }
            if (artifact.relativePath.includes("..")) {
                issues.push({
                    code: "ARTIFACT_TARGET_TRAVERSAL",
                    category: this.descriptor.category,
                    severity: codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL,
                    message: `Artifact target contains path traversal: ${artifact.relativePath}`,
                    artifactKey: artifact.key,
                    path: artifact.relativePath,
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
}
exports.CodeGenTemplateValidationRule = CodeGenTemplateValidationRule;
//# sourceMappingURL=codegen-template-validation.rule.js.map