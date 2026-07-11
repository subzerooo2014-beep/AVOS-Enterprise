import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
import { CodeGenSourceComplexityAnalyzer } from "./codegen-source-complexity-analyzer";
export declare class CodeGenComplexityRule implements CodeGenQualityRule {
    readonly analyzer: CodeGenSourceComplexityAnalyzer;
    readonly descriptor: {
        readonly key: "source-complexity";
        readonly name: "Source Complexity Rule";
        readonly description: "Detects generated source files with excessive estimated complexity";
        readonly category: CodeGenQualityRuleCategory.STRUCTURE;
        readonly severity: CodeGenQualitySeverity.WARNING;
        readonly enabled: true;
        readonly priority: 60;
        readonly capabilities: readonly ["complexity-analysis", "line-count-analysis"];
    };
    constructor(analyzer?: CodeGenSourceComplexityAnalyzer);
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-complexity.rule.d.ts.map