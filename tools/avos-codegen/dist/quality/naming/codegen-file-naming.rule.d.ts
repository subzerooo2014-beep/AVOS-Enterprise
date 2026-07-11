import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
export declare class CodeGenFileNamingRule implements CodeGenQualityRule {
    readonly descriptor: {
        readonly key: "file-naming";
        readonly name: "File Naming Rule";
        readonly description: "Ensures generated source filenames use kebab-case";
        readonly category: CodeGenQualityRuleCategory.NAMING;
        readonly severity: CodeGenQualitySeverity.ERROR;
        readonly enabled: true;
        readonly priority: 10;
        readonly capabilities: readonly ["filename-validation", "kebab-case-validation"];
    };
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-file-naming.rule.d.ts.map