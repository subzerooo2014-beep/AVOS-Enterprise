"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationPolicyRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenGenerationPolicyRule {
    descriptor = {
        key: "generation-policy",
        name: "Generation Policy",
        description: "Enforces production generation policies",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.POLICY,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR,
        enabled: true,
        priority: 40,
        capabilities: [
            "target-root-policy",
            "artifact-count-policy",
            "empty-content-policy",
        ],
    };
    validate(context) {
        const issues = [];
        if (!context.targetRoot.trim()) {
            issues.push({
                code: "TARGET_ROOT_REQUIRED",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: "Target root is required",
                path: "targetRoot",
            });
        }
        if (context.artifacts.length >
            5000) {
            issues.push({
                code: "ARTIFACT_LIMIT_EXCEEDED",
                category: this.descriptor.category,
                severity: codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL,
                message: "Artifact count exceeds production safety limit",
                details: {
                    artifacts: context.artifacts.length,
                    maximum: 5000,
                },
            });
        }
        for (const artifact of context.artifacts) {
            if (!artifact.content.trim()) {
                issues.push({
                    code: "EMPTY_ARTIFACT_CONTENT",
                    category: this.descriptor.category,
                    severity: codegen_validation_contracts_1.CodeGenValidationSeverity.WARNING,
                    message: `Generated artifact content is empty: ${artifact.key}`,
                    artifactKey: artifact.key,
                });
            }
        }
        return {
            ruleKey: this.descriptor.key,
            valid: issues.every((issue) => issue.severity !==
                codegen_validation_contracts_1.CodeGenValidationSeverity.ERROR &&
                issue.severity !==
                    codegen_validation_contracts_1.CodeGenValidationSeverity.CRITICAL),
            issues,
            checkedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenGenerationPolicyRule = CodeGenGenerationPolicyRule;
//# sourceMappingURL=codegen-generation-policy.rule.js.map