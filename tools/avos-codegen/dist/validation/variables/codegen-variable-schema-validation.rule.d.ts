import { CodeGenValidationCategory, CodeGenValidationContext, CodeGenValidationRule, CodeGenValidationRuleResult, CodeGenValidationSeverity } from "../contracts/codegen-validation.contracts";
export interface CodeGenVariableSchemaEntry {
    key: string;
    type: "string" | "number" | "boolean" | "object" | "array";
    required: boolean;
}
export declare class CodeGenVariableSchemaValidationRule implements CodeGenValidationRule {
    readonly schema: readonly CodeGenVariableSchemaEntry[];
    readonly descriptor: {
        readonly key: "variable-schema-validation";
        readonly name: "Variable Schema Validation";
        readonly description: "Validates generation variables against a simple production schema";
        readonly category: CodeGenValidationCategory.VARIABLES;
        readonly severity: CodeGenValidationSeverity.ERROR;
        readonly enabled: true;
        readonly priority: 30;
        readonly capabilities: readonly ["required-variable-validation", "variable-type-validation"];
    };
    constructor(schema?: readonly CodeGenVariableSchemaEntry[]);
    validate(context: CodeGenValidationContext): CodeGenValidationRuleResult;
    private matchesType;
}
//# sourceMappingURL=codegen-variable-schema-validation.rule.d.ts.map