import { CodeGenQualityRule, CodeGenQualityRuleCategory, CodeGenQualityRuleContext, CodeGenQualityRuleResult, CodeGenQualitySeverity } from "../contracts/codegen-quality.contracts";
export declare class CodeGenNestJsStructureRule implements CodeGenQualityRule {
    readonly descriptor: {
        readonly key: "nestjs-structure";
        readonly name: "NestJS Structure Rule";
        readonly description: "Validates generated NestJS modules, controllers, and services";
        readonly category: CodeGenQualityRuleCategory.NESTJS;
        readonly severity: CodeGenQualitySeverity.ERROR;
        readonly enabled: true;
        readonly priority: 30;
        readonly capabilities: readonly ["module-validation", "controller-validation", "service-validation"];
    };
    validate(context: CodeGenQualityRuleContext): CodeGenQualityRuleResult;
}
//# sourceMappingURL=codegen-nestjs-structure.rule.d.ts.map