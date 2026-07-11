import {
  CodeGenArtifactDescriptor,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenQualityRuntime,
} from "../../../quality/runtime/codegen-quality-runtime";
import {
  CodeGenValidationRuntime,
} from "../../../validation/runtime/codegen-validation-runtime";

export class CodeGenGeneratorV3QualityGate {
  constructor(
    readonly quality =
      new CodeGenQualityRuntime(),
    readonly validation =
      new CodeGenValidationRuntime(),
  ) {}

  async execute(
    input: {
      workspaceRoot: string;
      targetRoot: string;
      blueprintKey?: string;
      templateKeys?: string[];
      variables:
        Record<
          string,
          string | number | boolean | null
        >;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
    },
  ) {
    const quality =
      await this.quality.execute(
        input.artifacts,
        {
          owner:
            "AVOS",
          classification:
            "generator-v3-quality-gate",
        },
      );

    const validation =
      await this.validation.execute({
        workspaceRoot:
          input.workspaceRoot,
        targetRoot:
          input.targetRoot,
        ...(input.blueprintKey
          ? {
              blueprintKey:
                input.blueprintKey,
            }
          : {}),
        templateKeys:
          [...(input.templateKeys ?? [])],
        variables:
          input.variables,
        artifacts:
          [...input.artifacts],
        featureFlags: {},
        metadata: {
          owner:
            "AVOS",
          classification:
            "generator-v3-validation-gate",
        },
      });

    return {
      success:
        quality.success &&
        validation.report.success,
      quality,
      validation:
        validation.report,
      health:
        validation.health,
    };
  }
}
