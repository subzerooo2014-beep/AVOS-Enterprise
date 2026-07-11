import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenQualityRuntime } from "../../../quality/runtime/codegen-quality-runtime";
import { CodeGenValidationRuntime } from "../../../validation/runtime/codegen-validation-runtime";
export declare class CodeGenGeneratorV3QualityGate {
    readonly quality: CodeGenQualityRuntime;
    readonly validation: CodeGenValidationRuntime;
    constructor(quality?: CodeGenQualityRuntime, validation?: CodeGenValidationRuntime);
    execute(input: {
        workspaceRoot: string;
        targetRoot: string;
        blueprintKey?: string;
        templateKeys?: string[];
        variables: Record<string, string | number | boolean | null>;
        artifacts: readonly CodeGenArtifactDescriptor[];
    }): Promise<{
        success: boolean;
        quality: import("../../..").CodeGenQualityReport;
        validation: import("../../..").CodeGenEnterpriseValidationReport;
        health: import("../../..").CodeGenValidationHealth;
    }>;
}
//# sourceMappingURL=codegen-generator-v3-quality-gate.d.ts.map