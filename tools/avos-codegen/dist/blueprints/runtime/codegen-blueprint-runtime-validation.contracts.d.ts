import { CodeGenJsonValue } from "../../core/codegen.contracts";
import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenBlueprintRuntimeRequest } from "./codegen-blueprint-runtime.contracts";
export declare enum CodeGenBlueprintRuntimeValidationSeverity {
    INFORMATIONAL = "informational",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export interface CodeGenBlueprintRuntimeValidationIssue {
    code: string;
    message: string;
    severity: CodeGenBlueprintRuntimeValidationSeverity;
    path?: string;
    details?: Record<string, CodeGenJsonValue>;
}
export interface CodeGenBlueprintRuntimeValidationInput {
    blueprint: CodeGenBlueprintDefinition;
    request: CodeGenBlueprintRuntimeRequest;
    availableTemplateKeys: readonly string[];
    registeredBlueprintKeys: readonly string[];
}
export interface CodeGenBlueprintRuntimeValidationResult {
    valid: boolean;
    issues: CodeGenBlueprintRuntimeValidationIssue[];
    errors: CodeGenBlueprintRuntimeValidationIssue[];
    warnings: CodeGenBlueprintRuntimeValidationIssue[];
    validatedAt: string;
}
//# sourceMappingURL=codegen-blueprint-runtime-validation.contracts.d.ts.map