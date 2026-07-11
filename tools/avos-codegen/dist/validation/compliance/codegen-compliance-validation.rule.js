"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenComplianceValidationRule = void 0;
const codegen_validation_contracts_1 = require("../contracts/codegen-validation.contracts");
class CodeGenComplianceValidationRule {
    descriptor = {
        key: "compliance-validation",
        name: "Enterprise Compliance Validation",
        description: "Checks required metadata and auditability fields",
        category: codegen_validation_contracts_1.CodeGenValidationCategory.COMPLIANCE,
        severity: codegen_validation_contracts_1.CodeGenValidationSeverity.WARNING,
        enabled: true,
        priority: 60,
        capabilities: [
            "owner-metadata",
            "classification-metadata",
            "generated-by-metadata",
        ],
    };
    validate(context) {
        const issues = [];
        const requiredMetadata = [
            "owner",
            "classification",
        ];
        for (const key of requiredMetadata) {
            if (context.metadata[key] ===
                undefined) {
                issues.push({
                    code: "COMPLIANCE_METADATA_MISSING",
                    category: this.descriptor.category,
                    severity: this.descriptor.severity,
                    message: `Compliance metadata is missing: ${key}`,
                    path: `metadata.${key}`,
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
exports.CodeGenComplianceValidationRule = CodeGenComplianceValidationRule;
//# sourceMappingURL=codegen-compliance-validation.rule.js.map