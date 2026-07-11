import {
  CodeGenQualityRule,
  CodeGenQualityRuleCategory,
  CodeGenQualityRuleContext,
  CodeGenQualityRuleResult,
  CodeGenQualitySeverity,
} from "../contracts/codegen-quality.contracts";
import {
  CodeGenImportAnalyzer,
} from "./codegen-import-analyzer";

export class CodeGenDuplicateImportRule
  implements CodeGenQualityRule {
  readonly descriptor = {
    key:
      "duplicate-imports",
    name:
      "Duplicate Imports Rule",
    description:
      "Detects repeated imports from the same module",
    category:
      CodeGenQualityRuleCategory.IMPORTS,
    severity:
      CodeGenQualitySeverity.WARNING,
    enabled:
      true,
    priority:
      20,
    capabilities: [
      "duplicate-import-detection",
    ],
  } as const;

  constructor(
    readonly analyzer =
      new CodeGenImportAnalyzer(),
  ) {}

  validate(
    context:
      CodeGenQualityRuleContext,
  ): CodeGenQualityRuleResult {
    const records =
      this.analyzer.analyze(
        context.artifact.content,
      );

    const groups =
      new Map<
        string,
        typeof records
      >();

    for (const record of records) {
      const group =
        groups.get(
          record.source,
        ) ?? [];

      group.push(record);

      groups.set(
        record.source,
        group,
      );
    }

    const duplicates =
      Array.from(
        groups.entries(),
      )
        .filter(
          ([, group]) =>
            group.length > 1,
        );

    const issues =
      duplicates.map(
        ([source, group]) => {
          const firstLine =
            group[0]?.line;

          return {
            code:
              "DUPLICATE_IMPORT_SOURCE",
            category:
              this.descriptor.category,
            severity:
              this.descriptor.severity,
            message:
              `Duplicate imports from ${source}`,
            artifactKey:
              context.artifact.key,
            relativePath:
              context.artifact.relativePath,
            ...(firstLine !==
            undefined
              ? {
                  line:
                    firstLine,
                }
              : {}),
          };
        },
      );

    return {
      ruleKey:
        this.descriptor.key,
      valid:
        duplicates.length ===
        0,
      issues,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
