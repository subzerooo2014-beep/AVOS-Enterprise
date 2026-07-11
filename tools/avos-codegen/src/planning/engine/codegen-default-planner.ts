import {
  CodeGenPlanner,
  CodeGenPlannerDescriptor,
} from "../contracts/codegen-planner.contracts";
import {
  CodeGenPlanningContext,
  CodeGenPlanningResult,
} from "../contracts/codegen-planning.contracts";
import {
  CodeGenExecutionPlanBuilder,
} from "../builders/codegen-execution-plan-builder";
import {
  CodeGenPlanningValidator,
} from "../validation/codegen-planning-validator";

export class CodeGenDefaultPlanner
  implements CodeGenPlanner {
  readonly descriptor:
    CodeGenPlannerDescriptor = {
    key:
      "default-planner",
    name:
      "Default Generation Planner",
    description:
      "Creates ordered execution stages for CodeGen artifacts",
    version:
      "1.0.0-alpha.1",
    priority:
      100,
    enabled:
      true,
    capabilities: [
      "artifact-ordering",
      "stage-planning",
      "dependency-validation",
      "parallel-stage-detection",
    ],
  };

  constructor(
    readonly validator =
      new CodeGenPlanningValidator(),
    readonly builder =
      new CodeGenExecutionPlanBuilder(),
  ) {}

  plan(
    context:
      CodeGenPlanningContext,
  ): CodeGenPlanningResult {
    const diagnostics =
      this.validator.validate(
        context,
      );

    const errors =
      diagnostics
        .filter(
          (diagnostic) =>
            diagnostic.severity ===
              "error" ||
            diagnostic.severity ===
              "critical",
        )
        .map(
          (diagnostic) =>
            diagnostic.message,
        );

    const warnings =
      diagnostics
        .filter(
          (diagnostic) =>
            diagnostic.severity ===
            "warning",
        )
        .map(
          (diagnostic) =>
            diagnostic.message,
        );

    if (
      errors.length > 0
    ) {
      return {
        success: false,
        diagnostics,
        warnings,
        errors,
        generatedAt:
          new Date().toISOString(),
      };
    }

    const plan =
      this.builder.build(
        context,
      );

    plan.warnings.push(
      ...warnings,
    );

    return {
      success: true,
      plan,
      diagnostics,
      warnings,
      errors: [],
      generatedAt:
        new Date().toISOString(),
    };
  }
}
