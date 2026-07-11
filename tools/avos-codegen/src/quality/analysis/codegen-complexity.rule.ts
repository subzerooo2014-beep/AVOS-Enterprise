import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";
import {
  CodeGenSourceComplexityAnalyzer,
} from "./codegen-source-complexity-analyzer";

export class CodeGenComplexityRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "source-complexity",
    name:
      "Source Complexity Rule",
    description:
      "Detects generated source files with excessive estimated complexity",
    category:
      CodeGenQualityRuleCategory.STRUCTURE,
    severity:
      CodeGenQualitySeverity.WARNING,
    enabled:
      true,
    priority:
      60,
    capabilities: [
      "complexity-analysis",
      "line-count-analysis",
    ],
  } as const;

  constructor(
    readonly analyzer =
      new CodeGenSourceComplexityAnalyzer(),
  ) {}

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const complexity =
      this.analyzer.analyze(
        context.artifact.content,
      );

    const issues:
      CodeGenQualityRuleResult["issues"] =
      [];

    if (
      complexity.estimatedComplexity >
      25
    ) {
      issues.push({
        code:
          "HIGH_GENERATED_COMPLEXITY",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          `Generated source complexity is high: ${complexity.estimatedComplexity}`,
        artifactKey:
          context.artifact.key,
        relativePath:
          context.artifact.relativePath,
        details: {
          estimatedComplexity:
            complexity.estimatedComplexity,
          lines:
            complexity.lines,
        },
      });
    }

    if (
      complexity.lines >
      800
    ) {
      issues.push({
        code:
          "GENERATED_FILE_TOO_LARGE",
        category:
          this.descriptor.category,
        severity:
          this.descriptor.severity,
        message:
          `Generated source file is too large: ${complexity.lines} lines`,
        artifactKey:
          context.artifact.key,
        relativePath:
          context.artifact.relativePath,
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
