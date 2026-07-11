import {
  CodeGenValidationCategory,
  CodeGenValidationContext,
  CodeGenValidationRule,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export class CodeGenComplianceValidationRule
  implements CodeGenValidationRule {
  readonly descriptor = {
    key:
      "compliance-validation",
    name:
      "Enterprise Compliance Validation",
    description:
      "Checks required metadata and auditability fields",
    category:
      CodeGenValidationCategory.COMPLIANCE,
    severity:
      CodeGenValidationSeverity.WARNING,
    enabled:
      true,
    priority:
      60,
    capabilities: [
      "owner-metadata",
      "classification-metadata",
      "generated-by-metadata",
    ],
  } as const;

  validate(
    context:
      CodeGenValidationContext,
  ): CodeGenValidationRuleResult {
    const issues:
      CodeGenValidationRuleResult["issues"] =
      [];

    const requiredMetadata = [
      "owner",
      "classification",
    ];

    for (
      const key of
      requiredMetadata
    ) {
      if (
        context.metadata[key] ===
        undefined
      ) {
        issues.push({
          code:
            "COMPLIANCE_METADATA_MISSING",
          category:
            this.descriptor.category,
          severity:
            this.descriptor.severity,
          message:
            `Compliance metadata is missing: ${key}`,
          path:
            `metadata.${key}`,
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
