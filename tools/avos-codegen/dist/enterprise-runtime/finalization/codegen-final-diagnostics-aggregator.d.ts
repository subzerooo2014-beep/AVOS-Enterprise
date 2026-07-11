import { CodeGenEnterpriseRuntimeDiagnostic } from "../diagnostics/codegen-enterprise-runtime-diagnostics";
import { CodeGenProductionReadinessCheck } from "../readiness/codegen-production-readiness.contracts";
export declare class CodeGenFinalDiagnosticsAggregator {
    aggregate(input: {
        diagnostics: readonly CodeGenEnterpriseRuntimeDiagnostic[];
        checks: readonly CodeGenProductionReadinessCheck[];
    }): {
        success: boolean;
        warnings: string[];
        errors: string[];
        diagnostics: CodeGenEnterpriseRuntimeDiagnostic[];
        checks: CodeGenProductionReadinessCheck[];
        generatedAt: string;
    };
}
//# sourceMappingURL=codegen-final-diagnostics-aggregator.d.ts.map