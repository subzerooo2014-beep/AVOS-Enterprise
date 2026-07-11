"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDtoValidationRule = void 0;
const codegen_quality_contracts_1 = require("../contracts/codegen-quality.contracts");
class CodeGenDtoValidationRule {
    descriptor = {
        key: "dto-validation",
        name: "DTO Validation Rule",
        description: "Ensures generated DTO files use validation decorators",
        category: codegen_quality_contracts_1.CodeGenQualityRuleCategory.DTO,
        severity: codegen_quality_contracts_1.CodeGenQualitySeverity.WARNING,
        enabled: true,
        priority: 40,
        capabilities: [
            "class-validator-detection",
            "dto-class-validation",
        ],
    };
    validate(context) {
        const path = context.artifact.relativePath;
        if (!path.includes("/dto/") &&
            !path.includes("\\dto\\")) {
            return {
                ruleKey: this.descriptor.key,
                valid: true,
                issues: [],
                checkedAt: new Date().toISOString(),
            };
        }
        const content = context.artifact.content;
        const hasClass = content.includes("export class");
        const hasValidation = /@(IsString|IsNumber|IsBoolean|IsOptional|IsObject|IsISO8601|MaxLength)\b/.test(content);
        const issues = [];
        if (!hasClass) {
            issues.push({
                code: "DTO_CLASS_MISSING",
                category: this.descriptor.category,
                severity: codegen_quality_contracts_1.CodeGenQualitySeverity.ERROR,
                message: "DTO file must export a class",
                artifactKey: context.artifact.key,
                relativePath: path,
            });
        }
        if (!hasValidation) {
            issues.push({
                code: "DTO_VALIDATION_DECORATORS_MISSING",
                category: this.descriptor.category,
                severity: this.descriptor.severity,
                message: "DTO file should include class-validator decorators",
                artifactKey: context.artifact.key,
                relativePath: path,
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
exports.CodeGenDtoValidationRule = CodeGenDtoValidationRule;
//# sourceMappingURL=codegen-dto-validation.rule.js.map