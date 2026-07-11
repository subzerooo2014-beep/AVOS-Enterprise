import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenComplexityRule,
} from "../analysis/codegen-complexity.rule";
import {
  CodeGenDuplicateImportRule,
} from "../imports/codegen-duplicate-import.rule";
import {
  CodeGenFileNamingRule,
} from "../naming/codegen-file-naming.rule";
import {
  CodeGenDtoValidationRule,
} from "../validation/codegen-dto-validation.rule";
import {
  CodeGenNestJsStructureRule,
} from "../validation/codegen-nestjs-structure.rule";
import {
  CodeGenQualityRuleRegistry,
} from "../validation/codegen-quality-rule-registry";
import {
  CodeGenTestPresenceRule,
} from "../validation/codegen-test-presence.rule";
import {
  CodeGenQualityReportBuilder,
} from "../reports/codegen-quality-report-builder";

export class CodeGenQualityRuntime {
  constructor(
    readonly registry =
      new CodeGenQualityRuleRegistry(),
    readonly reports =
      new CodeGenQualityReportBuilder(),
  ) {
    if (
      this.registry.list()
        .length === 0
    ) {
      this.registerDefaults();
    }
  }

  async execute(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    metadata:
      CodeGenMetadata = {},
  ) {
    const startedAt =
      new Date().toISOString();

    const results = [];

    for (
      const artifact of
      artifacts
    ) {
      for (
        const rule of
        this.registry.list()
      ) {
        results.push(
          await rule.validate({
            artifact,
            allArtifacts:
              artifacts,
            metadata,
          }),
        );
      }
    }

    return this.reports.build({
      artifacts:
        artifacts.length,
      results,
      metadata,
      startedAt,
    });
  }

  private registerDefaults():
    void {
    const rules = [
      new CodeGenFileNamingRule(),
      new CodeGenDuplicateImportRule(),
      new CodeGenNestJsStructureRule(),
      new CodeGenDtoValidationRule(),
      new CodeGenTestPresenceRule(),
      new CodeGenComplexityRule(),
    ];

    for (const rule of rules) {
      this.registry.register(
        rule,
      );
    }
  }
}
