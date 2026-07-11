import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenBlueprintValidationRule,
} from "../blueprints/codegen-blueprint-validation.rule";
import {
  CodeGenComplianceValidationRule,
} from "../compliance/codegen-compliance-validation.rule";
import {
  CodeGenValidationContext,
} from "../contracts/codegen-validation.contracts";
import {
  CodeGenGenerationPolicyRule,
} from "../policies/codegen-generation-policy.rule";
import {
  CodeGenValidationRegistry,
} from "../registry/codegen-validation-registry";
import {
  CodeGenValidationReportBuilder,
} from "../reports/codegen-validation-report-builder";
import {
  CodeGenSecurityValidationRule,
} from "../security/codegen-security-validation.rule";
import {
  CodeGenTemplateValidationRule,
} from "../templates/codegen-template-validation.rule";
import {
  CodeGenVariableSchemaValidationRule,
} from "../variables/codegen-variable-schema-validation.rule";
import {
  CodeGenValidationHealthAnalyzer,
} from "../health/codegen-validation-health-analyzer";

export class CodeGenValidationRuntime {
  constructor(
    readonly registry =
      new CodeGenValidationRegistry(),
    readonly reports =
      new CodeGenValidationReportBuilder(),
    readonly health =
      new CodeGenValidationHealthAnalyzer(),
  ) {
    if (
      this.registry.list()
        .length === 0
    ) {
      this.registerDefaults();
    }
  }

  async execute(
    context:
      CodeGenValidationContext,
    metadata:
      CodeGenMetadata = {},
  ) {
    const startedAt =
      new Date().toISOString();

    const results = [];

    for (
      const rule of
      this.registry.list()
    ) {
      results.push(
        await rule.validate(
          context,
        ),
      );
    }

    const report =
      this.reports.build({
        results,
        metadata: {
          ...context.metadata,
          ...metadata,
        },
        startedAt,
      });

    return {
      report,
      health:
        this.health.analyze(
          report.issues,
        ),
    };
  }

  private registerDefaults():
    void {
    const rules = [
      new CodeGenBlueprintValidationRule(),
      new CodeGenTemplateValidationRule(),
      new CodeGenVariableSchemaValidationRule(),
      new CodeGenGenerationPolicyRule(),
      new CodeGenSecurityValidationRule(),
      new CodeGenComplianceValidationRule(),
    ];

    for (const rule of rules) {
      this.registry.register(
        rule,
      );
    }
  }
}
