import { CodeGenQualityRule } from "../contracts/codegen-quality.contracts";
export declare class CodeGenQualityRuleRegistry {
    private readonly rules;
    register(rule: CodeGenQualityRule, replace?: boolean): CodeGenQualityRule;
    get(key: string): CodeGenQualityRule;
    list(): readonly CodeGenQualityRule[];
    clear(): void;
}
//# sourceMappingURL=codegen-quality-rule-registry.d.ts.map