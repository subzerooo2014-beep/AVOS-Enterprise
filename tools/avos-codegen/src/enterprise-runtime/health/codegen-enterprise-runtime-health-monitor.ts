import {
  CodeGenEnterpriseRuntimeDiagnostic,
} from "../diagnostics/codegen-enterprise-runtime-diagnostics";

export interface CodeGenEnterpriseRuntimeHealth {
  status:
    | "healthy"
    | "degraded"
    | "unhealthy";
  diagnostics: number;
  warnings: number;
  errors: number;
  critical: number;
  checkedAt: string;
}

export class CodeGenEnterpriseRuntimeHealthMonitor {
  evaluate(
    diagnostics:
      readonly CodeGenEnterpriseRuntimeDiagnostic[],
  ): CodeGenEnterpriseRuntimeHealth {
    const critical =
      diagnostics.filter(
        (item) =>
          item.severity ===
          "critical",
      ).length;

    const errors =
      diagnostics.filter(
        (item) =>
          item.severity ===
          "error",
      ).length;

    const warnings =
      diagnostics.filter(
        (item) =>
          item.severity ===
          "warning",
      ).length;

    return {
      status:
        critical > 0
          ? "unhealthy"
          : errors > 0 ||
            warnings > 0
            ? "degraded"
            : "healthy",
      diagnostics:
        diagnostics.length,
      warnings,
      errors,
      critical,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
