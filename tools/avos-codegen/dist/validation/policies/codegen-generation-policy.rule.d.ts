import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export declare class CodeGenGenerationPolicyRule implements CodeGenValidationRule {
    readonly descriptor: {
        readonly key: "generation-policy";
        readonly name: "Generation Policy";
        readonly description: "Enforces production generation policies";
        readonly category: CodeGenValidationCategory.POLICY;
        readonly severity: CodeGenValidationSeverity.ERROR;
        readonly enabled: true;
        readonly priority: 40;
        readonly capabilities: readonly ["target-root-policy", "artifact-count-policy", "empty-content-policy"];
    };
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
}
//# sourceMappingURL=codegen-generation-policy.rule.d.ts.map