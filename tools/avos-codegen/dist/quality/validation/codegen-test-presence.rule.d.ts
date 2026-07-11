import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
export declare class CodeGenTestPresenceRule implements CodeGenQualityRule {
    readonly descriptor: {
        readonly key: "test-presence";
        readonly name: "Test Presence Rule";
        readonly description: "Requires generated services and controllers to have corresponding tests";
        readonly category: CodeGenQualityRuleCategory.TESTING;
        readonly severity: CodeGenQualitySeverity.WARNING;
        readonly enabled: true;
        readonly priority: 50;
        readonly capabilities: readonly ["test-presence-detection"];
    };
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-test-presence.rule.d.ts.map