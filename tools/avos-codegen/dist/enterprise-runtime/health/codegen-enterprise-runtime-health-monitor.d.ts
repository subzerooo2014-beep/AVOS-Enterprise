import { CodeGenEnterpriseRuntimeDiagnostic } from "../diagnostics/codegen-enterprise-runtime-diagnostics";
export interface CodeGenEnterpriseRuntimeHealth {
    status: "healthy" | "degraded" | "unhealthy";
    diagnostics: number;
    warnings: number;
    errors: number;
    critical: number;
    checkedAt: string;
}
export declare class CodeGenEnterpriseRuntimeHealthMonitor {
    evaluate(diagnostics: readonly CodeGenEnterpriseRuntimeDiagnostic[]): CodeGenEnterpriseRuntimeHealth;
}
//# sourceMappingURL=codegen-enterprise-runtime-health-monitor.d.ts.map