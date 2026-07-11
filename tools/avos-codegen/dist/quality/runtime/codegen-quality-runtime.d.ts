import { CodeGenArtifactDescriptor } from "../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenQualityRuleRegistry } from "../validation/codegen-quality-rule-registry";
import { CodeGenQualityReportBuilder } from "../reports/codegen-quality-report-builder";
export declare class CodeGenQualityRuntime {
    readonly registry: CodeGenQualityRuleRegistry;
    readonly reports: CodeGenQualityReportBuilder;
    constructor(registry?: CodeGenQualityRuleRegistry, reports?: CodeGenQualityReportBuilder);
    execute(artifacts: readonly CodeGenArtifactDescriptor[], metadata?: CodeGenMetadata): Promise<import("..").CodeGenQualityReport>;
    private registerDefaults;
}
//# sourceMappingURL=codegen-quality-runtime.d.ts.map