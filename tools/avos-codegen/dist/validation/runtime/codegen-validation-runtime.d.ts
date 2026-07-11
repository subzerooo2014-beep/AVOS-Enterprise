import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenValidationContext } from "../contracts/codegen-validation.contracts";
import { CodeGenValidationRegistry } from "../registry/codegen-validation-registry";
import { CodeGenValidationReportBuilder } from "../reports/codegen-validation-report-builder";
import { CodeGenValidationHealthAnalyzer } from "../health/codegen-validation-health-analyzer";
export declare class CodeGenValidationRuntime {
    readonly registry: CodeGenValidationRegistry;
    readonly reports: CodeGenValidationReportBuilder;
    readonly health: CodeGenValidationHealthAnalyzer;
    constructor(registry?: CodeGenValidationRegistry, reports?: CodeGenValidationReportBuilder, health?: CodeGenValidationHealthAnalyzer);
    execute(context: CodeGenValidationContext, metadata?: CodeGenMetadata): Promise<{
        report: import("../contracts/codegen-validation.contracts").CodeGenValidationReport;
        health: import("../health/codegen-validation-health-analyzer").CodeGenValidationHealth;
    }>;
    private registerDefaults;
}
//# sourceMappingURL=codegen-validation-runtime.d.ts.map