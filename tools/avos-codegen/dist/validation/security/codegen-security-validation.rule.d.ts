import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export declare class CodeGenSecurityValidationRule implements CodeGenValidationRule {
    readonly descriptor: {
        readonly key: "security-validation";
        readonly name: "Security Validation";
        readonly description: "Detects unsafe generated code patterns";
        readonly category: CodeGenValidationCategory.SECURITY;
        readonly severity: CodeGenValidationSeverity.CRITICAL;
        readonly enabled: true;
        readonly priority: 50;
        readonly capabilities: readonly ["eval-detection", "dynamic-function-detection", "shell-execution-detection", "path-traversal-detection"];
    };
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
}
//# sourceMappingURL=codegen-security-validation.rule.d.ts.map