import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenQualityReport, CodeGenQualityRuleResult } from "../contracts/codegen-quality.contracts";
export declare class CodeGenQualityReportBuilder {
    build(input: {
        artifacts: number;
        results: readonly CodeGenQualityRuleResult[];
        metadata?: CodeGenMetadata;
        startedAt: string;
    }): CodeGenQualityReport;
}
//# sourceMappingURL=codegen-quality-report-builder.d.ts.map