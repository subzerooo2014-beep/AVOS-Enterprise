import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export declare class CodeGenBlueprintValidationRule implements CodeGenValidationRule {
    readonly descriptor: {
        readonly key: "blueprint-validation";
        readonly name: "Blueprint Validation";
        readonly description: "Validates blueprint identity and template bindings";
        readonly category: CodeGenValidationCategory.BLUEPRINT;
        readonly severity: CodeGenValidationSeverity.ERROR;
        readonly enabled: true;
        readonly priority: 10;
        readonly capabilities: readonly ["blueprint-key-validation", "template-binding-validation"];
    };
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
}
//# sourceMappingURL=codegen-blueprint-validation.rule.d.ts.map