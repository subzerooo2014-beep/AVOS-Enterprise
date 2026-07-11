import {
  CodeGenValidationCategory,
  CodeGenValidationContext,
  CodeGenValidationRule,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export class CodeGenTemplateValidationRule
  implements CodeGenValidationRule {
  readonly descriptor = {
    key:
      "template-validation",
    name:
      "Template Validation",
    description:
      "Validates template keys and rendered artifact targets",
    category:
      CodeGenValidationCategory.TEMPLATE,
    severity:
      CodeGenValidationSeverity.ERROR,
    enabled:
      true,
    priority:
      20,
    capabilities: [
      "template-key-validation",
      "artifact-target-validation",
    ],
  } as const;

  validate(
    context:
      CodeGenValidationContext,
  ): CodeGenValidationRuleResult {
    const issues:
      CodeGenValidationRuleResult["issues"] =
      [];

    for (
      const templateKey of
      context.templateKeys
    ) {
      if (!templateKey.trim()) {
        issues.push({
          code:
            "TEMPLATE_KEY_EMPTY",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            "Template key cannot be empty",
          path:
            "templateKeys",
        });
      }
    }

    for (
      const artifact of
      context.artifacts
    ) {
      if (
        !artifact.relativePath.trim()
      ) {
        issues.push({
          code:
            "ARTIFACT_TARGET_EMPTY",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            `Artifact target path is empty: ${artifact.key}`,
          artifactKey:
            artifact.key,
        });
      }

      if (
        artifact.relativePath.includes(
          "..",
        )
      ) {
        issues.push({
          code:
            "ARTIFACT_TARGET_TRAVERSAL",
          category:
            this.descriptor.category,
          severity:
            CodeGenValidationSeverity.CRITICAL,
          message:
            `Artifact target contains path traversal: ${artifact.relativePath}`,
          artifactKey:
            artifact.key,
          path:
            artifact.relativePath,
        });
      }
    }

    return {
      ruleKey:
        this.descriptor.key,
      valid:
        issues.length === 0,
      issues,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
