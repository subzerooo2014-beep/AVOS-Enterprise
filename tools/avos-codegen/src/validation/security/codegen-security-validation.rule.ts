import {
  CodeGenValidationCategory,
  CodeGenValidationContext,
  CodeGenValidationRule,
  CodeGenValidationRuleResult,
  CodeGenValidationSeverity,
} from "../contracts/codegen-validation.contracts";

export class CodeGenSecurityValidationRule
  implements CodeGenValidationRule {
  readonly descriptor = {
    key:
      "security-validation",
    name:
      "Security Validation",
    description:
      "Detects unsafe generated code patterns",
    category:
      CodeGenValidationCategory.SECURITY,
    severity:
      CodeGenValidationSeverity.CRITICAL,
    enabled:
      true,
    priority:
      50,
    capabilities: [
      "eval-detection",
      "dynamic-function-detection",
      "shell-execution-detection",
      "path-traversal-detection",
    ],
  } as const;

  validate(
    context:
      CodeGenValidationContext,
  ): CodeGenValidationRuleResult {
    const issues:
      CodeGenValidationRuleResult["issues"] =
      [];

    const patterns = [
      {
        code:
          "UNSAFE_EVAL",
        expression:
          /\beval\s*\(/,
        message:
          "Generated source contains eval()",
      },
      {
        code:
          "UNSAFE_DYNAMIC_FUNCTION",
        expression:
          /new\s+Function\s*\(/,
        message:
          "Generated source contains dynamic Function constructor",
      },
      {
        code:
          "UNSAFE_SHELL_EXECUTION",
        expression:
          /\b(exec|execSync|spawn|spawnSync)\s*\(/,
        message:
          "Generated source contains shell execution",
      },
    ];

    for (
      const artifact of
      context.artifacts
    ) {
      for (
        const pattern of
        patterns
      ) {
        if (
          pattern.expression.test(
            artifact.content,
          )
        ) {
          issues.push({
            code:
              pattern.code,
            category:
              this.descriptor.category,
            severity:
              this.descriptor.severity,
            message:
              pattern.message,
            artifactKey:
              artifact.key,
            path:
              artifact.relativePath,
          });
        }
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
