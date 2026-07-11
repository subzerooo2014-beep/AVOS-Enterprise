import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";

export class CodeGenDtoValidationRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "dto-validation",
    name:
      "DTO Validation Rule",
    description:
      "Ensures generated DTO files use validation decorators",
    category:
      CodeGenQualityRuleCategory.DTO,
    severity:
      CodeGenQualitySeverity.WARNING,
    enabled:
      true,
    priority:
      40,
    capabilities: [
      "class-validator-detection",
      "dto-class-validation",
    ],
  } as const;

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const path =
      context.artifact.relativePath;

    if (
      !path.includes(
        "/dto/",
      ) &&
      !path.includes(
        "\\dto\\",
      )
    ) {
      return {
        ruleKey:
          this.descriptor.key,
        valid: true,
        issues: [],
        checkedAt:
          new Date().toISOString(),
      };
    }

    const content =
      context.artifact.content;

    const hasClass =
      content.includes(
        "export class",
      );

    const hasValidation =
      /@(IsString|IsNumber|IsBoolean|IsOptional|IsObject|IsISO8601|MaxLength)\b/.test(
        content,
      );

    const issues:
      CodeGenQualityRuleResult["issues"] =
      [];

    if (!hasClass) {
      issues.push({
        code:
          "DTO_CLASS_MISSING",
        category:
          this.descriptor.category,
        severity:
          CodeGenQualitySeverity.ERROR,
        message:
          "DTO file must export a class",
        artifactKey:
          context.artifact.key,
        relativePath:
          path,
      });
    }

    if (!hasValidation) {
      issues.push({
        code:
          "DTO_VALIDATION_DECORATORS_MISSING",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          "DTO file should include class-validator decorators",
        artifactKey:
          context.artifact.key,
        relativePath:
          path,
      });
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
