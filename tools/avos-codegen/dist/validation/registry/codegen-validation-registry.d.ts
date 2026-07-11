import { CodeGenValidationRule } from "../contracts/codegen-validation.contracts";
export declare class CodeGenValidationRegistry {
    private readonly rules;
    register(rule: CodeGenValidationRule, replace?: boolean): CodeGenValidationRule;
    get(key: string): CodeGenValidationRule;
    list(): readonly CodeGenValidationRule[];
    clear(): void;
}
//# sourceMappingURL=codegen-validation-registry.d.ts.map