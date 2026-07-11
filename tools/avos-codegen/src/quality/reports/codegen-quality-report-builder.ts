import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenQualityIssue,
  CodeGenQualityReport,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";

export class CodeGenQualityReportBuilder {
  build(
    input: {
      artifacts: number;
      results:
        readonly CodeGenQualityRuleResult[];
      metadata?:
        CodeGenMetadata;
      startedAt: string;
    },
  ): CodeGenQualityReport {
    const completedAt =
      new Date().toISOString();

    const issues:
      CodeGenQualityIssue[] =
      input.results.flatMap(
        (result) =>
          result.issues,
      );

    const errors =
      issues.filter(
        (issue) =>
          issue.severity ===
            CodeGenQualitySeverity.ERROR ||
          issue.severity ===
            CodeGenQualitySeverity.CRITICAL,
      ).length;

    const warnings =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenQualitySeverity.WARNING,
      ).length;

    const informational =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenQualitySeverity.INFORMATIONAL,
      ).length;

    const maximumPenalty =
      Math.max(
        1,
        input.results.length *
        10,
      );

    const penalty =
      errors * 10 +
      warnings * 3 +
      informational;

    return {
      success:
        errors === 0,
      artifacts:
        input.artifacts,
      rules:
        input.results.length,
      passedRules:
        input.results.filter(
          (result) =>
            result.valid,
        ).length,
      failedRules:
        input.results.filter(
          (result) =>
            !result.valid,
        ).length,
      issues,
      errors,
      warnings,
      informational,
      score:
        Math.max(
          0,
          Math.round(
            100 -
            penalty /
            maximumPenalty *
            100,
          ),
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
