import {
  isAbsolute,
  resolve,
} from "node:path";
import {
  CodeGenBlueprintStatus,
} from "../codegen-blueprint.contracts";
import {
  CodeGenBlueprintRuntimeValidationInput,
  CodeGenBlueprintRuntimeValidationIssue,
  CodeGenBlueprintRuntimeValidationResult,
  CodeGenBlueprintRuntimeValidationSeverity,
} from "./codegen-blueprint-runtime-validation.contracts";

export class CodeGenBlueprintRuntimeValidator {
  validate(
    input:
      CodeGenBlueprintRuntimeValidationInput,
  ): CodeGenBlueprintRuntimeValidationResult {
    const issues:
      CodeGenBlueprintRuntimeValidationIssue[] =
      [];

    const blueprint =
      input.blueprint;

    const request =
      input.request;

    if (
      blueprint.status !==
      CodeGenBlueprintStatus.ACTIVE
    ) {
      issues.push({
        code:
          "BLUEPRINT_NOT_ACTIVE",
        message:
          `Blueprint is not active: ${blueprint.key}`,
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "blueprint.status",
      });
    }

    if (
      request.blueprintKey !==
      blueprint.key
    ) {
      issues.push({
        code:
          "BLUEPRINT_KEY_MISMATCH",
        message:
          `Request blueprint key ${request.blueprintKey} does not match definition ${blueprint.key}`,
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "request.blueprintKey",
      });
    }

    if (
      !request.workspaceRoot.trim()
    ) {
      issues.push({
        code:
          "WORKSPACE_ROOT_REQUIRED",
        message:
          "Workspace root is required",
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "request.workspaceRoot",
      });
    } else if (
      !isAbsolute(
        resolve(
          request.workspaceRoot,
        ),
      )
    ) {
      issues.push({
        code:
          "WORKSPACE_ROOT_INVALID",
        message:
          "Workspace root must resolve to an absolute path",
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "request.workspaceRoot",
      });
    }

    if (
      !request.targetRoot.trim()
    ) {
      issues.push({
        code:
          "TARGET_ROOT_REQUIRED",
        message:
          "Target root is required",
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "request.targetRoot",
      });
    } else if (
      !isAbsolute(
        resolve(
          request.targetRoot,
        ),
      )
    ) {
      issues.push({
        code:
          "TARGET_ROOT_INVALID",
        message:
          "Target root must resolve to an absolute path",
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.ERROR,
        path:
          "request.targetRoot",
      });
    }

    const duplicateTemplateKeys =
      blueprint.templateBindings
        .map(
          (binding) =>
            binding.templateKey,
        )
        .filter(
          (key, index, values) =>
            values.indexOf(key) !==
            index,
        );

    for (
      const duplicateKey of
      Array.from(
        new Set(
          duplicateTemplateKeys,
        ),
      )
    ) {
      issues.push({
        code:
          "DUPLICATE_TEMPLATE_BINDING",
        message:
          `Duplicate template binding: ${duplicateKey}`,
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.WARNING,
        path:
          "blueprint.templateBindings",
      });
    }

    for (
      const binding of
      blueprint.templateBindings
        .filter(
          (item) =>
            item.enabled,
        )
    ) {
      if (
        !input.availableTemplateKeys.includes(
          binding.templateKey,
        )
      ) {
        issues.push({
          code:
            "TEMPLATE_NOT_AVAILABLE",
          message:
            `Blueprint template was not found: ${binding.templateKey}`,
          severity:
            CodeGenBlueprintRuntimeValidationSeverity.ERROR,
          path:
            `blueprint.templateBindings.${binding.templateKey}`,
        });
      }

      if (
        binding.order < 0 ||
        !Number.isInteger(
          binding.order,
        )
      ) {
        issues.push({
          code:
            "INVALID_TEMPLATE_ORDER",
          message:
            `Template order must be a non-negative integer: ${binding.templateKey}`,
          severity:
            CodeGenBlueprintRuntimeValidationSeverity.ERROR,
          path:
            `blueprint.templateBindings.${binding.templateKey}.order`,
        });
      }
    }

    for (
      const dependencyKey of
      blueprint.dependencies
    ) {
      if (
        dependencyKey ===
        blueprint.key
      ) {
        issues.push({
          code:
            "SELF_DEPENDENCY",
          message:
            `Blueprint cannot depend on itself: ${blueprint.key}`,
          severity:
            CodeGenBlueprintRuntimeValidationSeverity.ERROR,
          path:
            "blueprint.dependencies",
        });

        continue;
      }

      if (
        !input.registeredBlueprintKeys.includes(
          dependencyKey,
        )
      ) {
        issues.push({
          code:
            "BLUEPRINT_DEPENDENCY_NOT_REGISTERED",
          message:
            `Blueprint dependency is not registered: ${dependencyKey}`,
          severity:
            CodeGenBlueprintRuntimeValidationSeverity.ERROR,
          path:
            "blueprint.dependencies",
        });
      }
    }

    if (
      blueprint.templateBindings
        .filter(
          (binding) =>
            binding.enabled,
        ).length === 0
    ) {
      issues.push({
        code:
          "NO_ACTIVE_TEMPLATE_BINDINGS",
        message:
          `Blueprint has no enabled template bindings: ${blueprint.key}`,
        severity:
          CodeGenBlueprintRuntimeValidationSeverity.WARNING,
        path:
          "blueprint.templateBindings",
      });
    }

    const errors =
      issues.filter(
        (issue) =>
          issue.severity ===
            CodeGenBlueprintRuntimeValidationSeverity.ERROR ||
          issue.severity ===
            CodeGenBlueprintRuntimeValidationSeverity.CRITICAL,
      );

    const warnings =
      issues.filter(
        (issue) =>
          issue.severity ===
          CodeGenBlueprintRuntimeValidationSeverity.WARNING,
      );

    return {
      valid:
        errors.length === 0,
      issues,
      errors,
      warnings,
      validatedAt:
        new Date().toISOString(),
    };
  }
}
