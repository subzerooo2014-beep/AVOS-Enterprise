import {
  CodeGenValidationCategory,
  CodeGenValidationContext,
  CodeGenValidationRule,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export class CodeGenGenerationPolicyRule
  implements CodeGenValidationRule {
  readonly descriptor = {
    key:
      "generation-policy",
    name:
      "Generation Policy",
    description:
      "Enforces production generation policies",
    category:
      CodeGenValidationCategory.POLICY,
    severity:
      CodeGenValidationSeverity.ERROR,
    enabled:
      true,
    priority:
      40,
    capabilities: [
      "target-root-policy",
      "artifact-count-policy",
      "empty-content-policy",
    ],
  } as const;

  validate(
    context:
      CodeGenValidationContext,
  ): CodeGenValidationRuleResult {
    const issues:
      CodeGenValidationRuleResult["issues"] =
      [];

    if (
      !context.targetRoot.trim()
    ) {
      issues.push({
        code:
          "TARGET_ROOT_REQUIRED",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          "Target root is required",
        path:
          "targetRoot",
      });
    }

    if (
      context.artifacts.length >
      5000
    ) {
      issues.push({
        code:
          "ARTIFACT_LIMIT_EXCEEDED",
        category:
          this.descriptor.category,
        severity:
          CodeGenValidationSeverity.CRITICAL,
        message:
          "Artifact count exceeds production safety limit",
        details: {
          artifacts:
            context.artifacts.length,
          maximum:
            5000,
        },
      });
    }

    for (
      const artifact of
      context.artifacts
    ) {
      if (
        !artifact.content.trim()
      ) {
        issues.push({
          code:
            "EMPTY_ARTIFACT_CONTENT",
          category:
            this.descriptor.category,
          severity:
            CodeGenValidationSeverity.WARNING,
          message:
            `Generated artifact content is empty: ${artifact.key}`,
          artifactKey:
            artifact.key,
        });
      }
    }

    return {
      ruleKey:
        this.descriptor.key,
      valid:
        issues.every(
          (issue) =>
            issue.severity !==
              CodeGenValidationSeverity.ERROR &&
            issue.severity !==
              CodeGenValidationSeverity.CRITICAL,
        ),
      issues,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
