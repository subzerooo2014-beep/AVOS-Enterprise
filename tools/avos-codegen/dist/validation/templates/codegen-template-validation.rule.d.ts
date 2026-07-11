import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export declare class CodeGenTemplateValidationRule implements CodeGenValidationRule {
    readonly descriptor: {
        readonly key: "template-validation";
        readonly name: "Template Validation";
        readonly description: "Validates template keys and rendered artifact targets";
        readonly category: CodeGenValidationCategory.TEMPLATE;
        readonly severity: CodeGenValidationSeverity.ERROR;
        readonly enabled: true;
        readonly priority: 20;
        readonly capabilities: readonly ["template-key-validation", "artifact-target-validation"];
    };
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
}
//# sourceMappingURL=codegen-template-validation.rule.d.ts.map