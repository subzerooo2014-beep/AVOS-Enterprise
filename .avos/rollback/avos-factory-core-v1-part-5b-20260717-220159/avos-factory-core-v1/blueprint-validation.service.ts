import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  AvosBlueprint,
  BlueprintStep,
  BlueprintValidationIssue,
  BlueprintValidationResult
} from "./blueprint.contracts";

@Injectable()
export class BlueprintValidationService {
  validate(
    blueprint: AvosBlueprint
  ): BlueprintValidationResult {
    const errors: BlueprintValidationIssue[] = [];
    const warnings: BlueprintValidationIssue[] = [];

    if (!blueprint) {
      errors.push({
        code: "BLUEPRINT_REQUIRED",
        message: "Blueprint is required.",
        severity: "error"
      });

      return {
        valid: false,
        errors,
        warnings
      };
    }

    this.validateIdentity(
      blueprint,
      errors
    );

    this.validateMetadata(
      blueprint,
      errors,
      warnings
    );

    this.validateVariables(
      blueprint,
      errors,
      warnings
    );

    this.validateSteps(
      blueprint.steps,
      errors,
      warnings
    );

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  assertValid(
    result: BlueprintValidationResult
  ): void {
    if (result.valid) {
      return;
    }

    throw new BadRequestException({
      message:
        "AVOS Blueprint validation failed.",
      errors: result.errors,
      warnings: result.warnings
    });
  }

  private validateIdentity(
    blueprint: AvosBlueprint,
    errors: BlueprintValidationIssue[]
  ): void {
    if (
      typeof blueprint.id !== "string" ||
      blueprint.id.trim().length === 0
    ) {
      errors.push({
        code: "BLUEPRINT_ID_REQUIRED",
        message:
          "Blueprint id is required.",
        path: "id",
        severity: "error"
      });
    }

    if (
      typeof blueprint.name !== "string" ||
      blueprint.name.trim().length === 0
    ) {
      errors.push({
        code: "BLUEPRINT_NAME_REQUIRED",
        message:
          "Blueprint name is required.",
        path: "name",
        severity: "error"
      });
    }

    if (
      typeof blueprint.version !== "string" ||
      !/^\d+\.\d+\.\d+$/.test(
        blueprint.version
      )
    ) {
      errors.push({
        code: "BLUEPRINT_VERSION_INVALID",
        message:
          "Blueprint version must use semantic version format.",
        path: "version",
        severity: "error"
      });
    }

    if (
      typeof blueprint.status !== "string" ||
      blueprint.status.trim().length === 0
    ) {
      errors.push({
        code: "BLUEPRINT_STATUS_REQUIRED",
        message:
          "Blueprint status is required.",
        path: "status",
        severity: "error"
      });
    }
  }

  private validateMetadata(
    blueprint: AvosBlueprint,
    errors: BlueprintValidationIssue[],
    warnings: BlueprintValidationIssue[]
  ): void {
    if (
      !blueprint.metadata ||
      typeof blueprint.metadata !== "object"
    ) {
      errors.push({
        code: "BLUEPRINT_METADATA_REQUIRED",
        message:
          "Blueprint metadata is required.",
        path: "metadata",
        severity: "error"
      });

      return;
    }

    if (
      typeof blueprint.metadata.createdBy !==
        "string" ||
      blueprint.metadata.createdBy
        .trim().length === 0
    ) {
      errors.push({
        code: "BLUEPRINT_CREATOR_REQUIRED",
        message:
          "metadata.createdBy is required.",
        path: "metadata.createdBy",
        severity: "error"
      });
    }

    if (
      typeof blueprint.metadata.createdAt !==
        "string" ||
      Number.isNaN(
        Date.parse(
          blueprint.metadata.createdAt
        )
      )
    ) {
      errors.push({
        code:
          "BLUEPRINT_CREATED_AT_INVALID",
        message:
          "metadata.createdAt must be a valid ISO date.",
        path: "metadata.createdAt",
        severity: "error"
      });
    }

    if (
      blueprint.metadata
        .humanFinalAuthority !== true
    ) {
      warnings.push({
        code:
          "HUMAN_FINAL_AUTHORITY_NOT_ENABLED",
        message:
          "Human Final Authority should be enabled for governed blueprints.",
        path:
          "metadata.humanFinalAuthority",
        severity: "warning"
      });
    }
  }

  private validateVariables(
    blueprint: AvosBlueprint,
    errors: BlueprintValidationIssue[],
    warnings: BlueprintValidationIssue[]
  ): void {
    if (!blueprint.variables) {
      return;
    }

    if (!Array.isArray(blueprint.variables)) {
      errors.push({
        code:
          "BLUEPRINT_VARIABLES_INVALID",
        message:
          "Blueprint variables must be an array.",
        path: "variables",
        severity: "error"
      });

      return;
    }

    const names = new Set<string>();

    blueprint.variables.forEach(
      (variable, index) => {
        const path = `variables[${index}]`;

        if (
          typeof variable.name !== "string" ||
          variable.name.trim().length === 0
        ) {
          errors.push({
            code:
              "BLUEPRINT_VARIABLE_NAME_REQUIRED",
            message:
              "Blueprint variable name is required.",
            path: `${path}.name`,
            severity: "error"
          });

          return;
        }

        if (names.has(variable.name)) {
          errors.push({
            code:
              "BLUEPRINT_VARIABLE_DUPLICATE",
            message:
              `Duplicate blueprint variable "${variable.name}".`,
            path: `${path}.name`,
            severity: "error"
          });
        }

        names.add(variable.name);

        if (
          variable.required &&
          variable.value === undefined
        ) {
          warnings.push({
            code:
              "BLUEPRINT_REQUIRED_VARIABLE_EMPTY",
            message:
              `Required variable "${variable.name}" has no value.`,
            path: `${path}.value`,
            severity: "warning"
          });
        }
      }
    );
  }

  private validateSteps(
    steps: BlueprintStep[],
    errors: BlueprintValidationIssue[],
    warnings: BlueprintValidationIssue[]
  ): void {
    if (
      !Array.isArray(steps) ||
      steps.length === 0
    ) {
      errors.push({
        code: "BLUEPRINT_STEPS_REQUIRED",
        message:
          "Blueprint must contain at least one step.",
        path: "steps",
        severity: "error"
      });

      return;
    }

    const stepIds =
      new Set<string>();

    steps.forEach(
      (step, index) => {
        const path = `steps[${index}]`;

        if (
          typeof step.id !== "string" ||
          step.id.trim().length === 0
        ) {
          errors.push({
            code:
              "BLUEPRINT_STEP_ID_REQUIRED",
            message:
              "Blueprint step id is required.",
            path: `${path}.id`,
            severity: "error"
          });
        } else if (
          stepIds.has(step.id)
        ) {
          errors.push({
            code:
              "BLUEPRINT_STEP_ID_DUPLICATE",
            message:
              `Duplicate blueprint step id "${step.id}".`,
            path: `${path}.id`,
            severity: "error"
          });
        } else {
          stepIds.add(step.id);
        }

        if (
          typeof step.name !== "string" ||
          step.name.trim().length === 0
        ) {
          errors.push({
            code:
              "BLUEPRINT_STEP_NAME_REQUIRED",
            message:
              "Blueprint step name is required.",
            path: `${path}.name`,
            severity: "error"
          });
        }

        if (
          step.type === "generator" &&
          (
            !step.pluginId ||
            !step.target
          )
        ) {
          errors.push({
            code:
              "GENERATOR_STEP_CONFIGURATION_INVALID",
            message:
              `Generator step "${step.id}" requires pluginId and target.`,
            path,
            severity: "error"
          });
        }

        if (
          step.type === "template" &&
          !step.templateId
        ) {
          errors.push({
            code:
              "TEMPLATE_STEP_CONFIGURATION_INVALID",
            message:
              `Template step "${step.id}" requires templateId.`,
            path,
            severity: "error"
          });
        }

        if (step.enabled === false) {
          warnings.push({
            code:
              "BLUEPRINT_STEP_DISABLED",
            message:
              `Blueprint step "${step.id}" is disabled.`,
            path,
            severity: "warning"
          });
        }
      }
    );

    steps.forEach(
      (step, index) => {
        for (
          const dependency
          of step.dependsOn ?? []
        ) {
          if (!stepIds.has(dependency)) {
            errors.push({
              code:
                "BLUEPRINT_DEPENDENCY_NOT_FOUND",
              message:
                `Step "${step.id}" depends on unknown step "${dependency}".`,
              path:
                `steps[${index}].dependsOn`,
              severity: "error"
            });
          }

          if (dependency === step.id) {
            errors.push({
              code:
                "BLUEPRINT_SELF_DEPENDENCY",
              message:
                `Step "${step.id}" cannot depend on itself.`,
              path:
                `steps[${index}].dependsOn`,
              severity: "error"
            });
          }
        }
      }
    );
  }
}
