import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";
import {
  filenameWithoutExtensions,
  isKebabCase,
  pathFilename,
} from "./codegen-naming.utilities";

export class CodeGenFileNamingRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "file-naming",
    name:
      "File Naming Rule",
    description:
      "Ensures generated source filenames use kebab-case",
    category:
      CodeGenQualityRuleCategory.NAMING,
    severity:
      CodeGenQualitySeverity.ERROR,
    enabled:
      true,
    priority:
      10,
    capabilities: [
      "filename-validation",
      "kebab-case-validation",
    ],
  } as const;

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const filename =
      pathFilename(
        context.artifact.relativePath,
      );

    const base =
      filenameWithoutExtensions(
        filename,
      )
        .replace(
          /\.(controller|service|module|spec|test|dto|manifest)$/,
          "",
        );

    const valid =
      !filename ||
      isKebabCase(base);

    return {
      ruleKey:
        this.descriptor.key,
      valid,
      issues:
        valid
          ? []
          : [
              {
                code:
                  "INVALID_FILE_NAMING",
                category:
                  this.descriptor.category,
                severity:
                  this.descriptor.severity,
                message:
                  `Generated filename must use kebab-case: ${filename}`,
                artifactKey:
                  context.artifact.key,
                relativePath:
                  context.artifact.relativePath,
              },
            ],
      checkedAt:
        new Date().toISOString(),
    };
  }
}
