import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenValidationIssue,
  CodeGenValidationReport,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export class CodeGenValidationReportBuilder {
  build(
    input: {
      results:
        readonly CodeGenValidationRuleResult[];
      metadata?:
        CodeGenMetadata;
      startedAt: string;
    },
  ): CodeGenValidationReport {
    const completedAt =
      new Date().toISOString();

    const issues:
      CodeGenValidationIssue[] =
      input.results.flatMap(
        (result) =>
          result.issues,
      );

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

    const penalty =
      critical * 30 +
      errors * 12 +
      warnings * 3;

    return {
      success:
        critical === 0 &&
        errors === 0,
      rules:
        input.results.length,
      passed:
        input.results.filter(
          (result) =>
            result.valid,
        ).length,
      failed:
        input.results.filter(
          (result) =>
            !result.valid,
        ).length,
      issues,
      errors,
      warnings,
      critical,
      score:
        Math.max(
          0,
          100 - penalty,
        ),
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      startedAt:
        input.startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          input.startedAt,
        ),
    };
  }
}
