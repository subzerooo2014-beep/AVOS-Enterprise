import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export declare class CodeGenComplianceValidationRule implements CodeGenValidationRule {
    readonly descriptor: {
        readonly key: "compliance-validation";
        readonly name: "Enterprise Compliance Validation";
        readonly description: "Checks required metadata and auditability fields";
        readonly category: CodeGenValidationCategory.COMPLIANCE;
        readonly severity: CodeGenValidationSeverity.WARNING;
        readonly enabled: true;
        readonly priority: 60;
        readonly capabilities: readonly ["owner-metadata", "classification-metadata", "generated-by-metadata"];
    };
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
}
//# sourceMappingURL=codegen-compliance-validation.rule.d.ts.map