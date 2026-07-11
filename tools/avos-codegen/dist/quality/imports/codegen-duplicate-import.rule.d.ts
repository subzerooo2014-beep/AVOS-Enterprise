import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
import { CodeGenImportAnalyzer } from "./codegen-import-analyzer";
export declare class CodeGenDuplicateImportRule implements CodeGenQualityRule {
    readonly analyzer: CodeGenImportAnalyzer;
    readonly descriptor: {
        readonly key: "duplicate-imports";
        readonly name: "Duplicate Imports Rule";
        readonly description: "Detects repeated imports from the same module";
        readonly category: CodeGenQualityRuleCategory.IMPORTS;
        readonly severity: CodeGenQualitySeverity.WARNING;
        readonly enabled: true;
        readonly priority: 20;
        readonly capabilities: readonly ["duplicate-import-detection"];
    };
    constructor(analyzer?: CodeGenImportAnalyzer);
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-duplicate-import.rule.d.ts.map