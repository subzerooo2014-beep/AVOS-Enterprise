import {
  CodeGenValidationIssue,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export interface CodeGenValidationHealth {
  status:
    | "healthy"
    | "degraded"
    | "unhealthy";
  errors: number;
  warnings: number;
  critical: number;
  checkedAt: string;
}

export class CodeGenValidationHealthAnalyzer {
  analyze(
    issues:
      readonly CodeGenValidationIssue[],
  ): CodeGenValidationHealth {
    const critical =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenValidationSeverity.CRITICAL,
      ).length;

    const errors =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenValidationSeverity.ERROR,
      ).length;

    const warnings =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenValidationSeverity.WARNING,
      ).length;

    return {
      status:
        critical > 0
          ? "unhealthy"
          : errors > 0
            ? "degraded"
            : "healthy",
      errors,
      warnings,
      critical,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
