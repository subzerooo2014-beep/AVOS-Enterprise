import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";

export class CodeGenTestPresenceRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "test-presence",
    name:
      "Test Presence Rule",
    description:
      "Requires generated services and controllers to have corresponding tests",
    category:
      CodeGenQualityRuleCategory.TESTING,
    severity:
      CodeGenQualitySeverity.WARNING,
    enabled:
      true,
    priority:
      50,
    capabilities: [
      "test-presence-detection",
    ],
  } as const;

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const path =
      context.artifact.relativePath;

    if (
      !path.endsWith(
        ".service.ts",
      ) &&
      !path.endsWith(
        ".controller.ts",
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

    const testPath =
      path.replace(
        /\.ts$/,
        ".spec.ts",
      );

    const exists =
      context.allArtifacts.some(
        (artifact) =>
          artifact.relativePath ===
          testPath,
      );

    return {
      ruleKey:
        this.descriptor.key,
      valid:
        exists,
      issues:
        exists
          ? []
          : [
              {
                code:
                  "GENERATED_TEST_MISSING",
                category:
                  this.descriptor.category,
                severity:
                  this.descriptor.severity,
                message:
                  `Generated test file is missing: ${testPath}`,
                artifactKey:
                  context.artifact.key,
                relativePath:
                  path,
              },
            ],
      checkedAt:
        new Date().toISOString(),
    };
  }
}
