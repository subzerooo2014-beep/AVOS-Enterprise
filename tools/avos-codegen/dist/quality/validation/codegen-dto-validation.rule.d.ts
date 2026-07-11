import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
export declare class CodeGenDtoValidationRule implements CodeGenQualityRule {
    readonly descriptor: {
        readonly key: "dto-validation";
        readonly name: "DTO Validation Rule";
        readonly description: "Ensures generated DTO files use validation decorators";
        readonly category: CodeGenQualityRuleCategory.DTO;
        readonly severity: CodeGenQualitySeverity.WARNING;
        readonly enabled: true;
        readonly priority: 40;
        readonly capabilities: readonly ["class-validator-detection", "dto-class-validation"];
    };
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-dto-validation.rule.d.ts.map