import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenValidationReport, CodeGenValidationRuleResult } from "../contracts/codegen-validation.contracts";
export declare class CodeGenValidationReportBuilder {
    build(input: {
        results: readonly CodeGenValidationRuleResult[];
        metadata?: CodeGenMetadata;
        startedAt: string;
    }): CodeGenValidationReport;
}
//# sourceMappingURL=codegen-validation-report-builder.d.ts.map