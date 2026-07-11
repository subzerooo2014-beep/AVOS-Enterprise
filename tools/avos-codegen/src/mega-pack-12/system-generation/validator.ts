import {
  SystemGenerationRequest,
  SystemGenerationValidationIssue,
  SystemGenerationValidationResult,
} from "./contracts";
import {
  SystemGenerationDependencyGraphBuilder,
} from "./dependency-graph-builder";

export class SystemGenerationValidator {
  constructor(
    readonly graphBuilder =
      new SystemGenerationDependencyGraphBuilder(),
  ) {}

  validate(
    request:
      SystemGenerationRequest,
  ): SystemGenerationValidationResult {
    const issues:
      SystemGenerationValidationIssue[] =
      [];

    if (!request.key.trim()) {
      issues.push({
        code:
          "REQUEST_KEY_REQUIRED",
        message:
          "System generation request key is required.",
        blocking: true,
      });
    }

    if (
      request.components.length ===
      0
    ) {
      issues.push({
        code:
          "COMPONENTS_REQUIRED",
        message:
          "At least one system component is required.",
        blocking: true,
      });
    }

    const componentKeys =
      request.components.map(
        (component) =>
          component.key,
      );

    const duplicateKeys =
      componentKeys.filter(
        (
          key,
          index,
          values,
        ) =>
          values.indexOf(key) !==
          index,
      );

    for (
      const duplicateKey of
      new Set(duplicateKeys)
    ) {
      issues.push({
        code:
          "DUPLICATE_COMPONENT_KEY",
        message:
          `Duplicate component key: ${duplicateKey}`,
        componentKey:
          duplicateKey,
        blocking: true,
      });
    }

    const available =
      new Set(componentKeys);

    for (
      const component of
      request.components
    ) {
      for (
        const dependency of
        component.dependencies
      ) {
        if (
          !available.has(
            dependency,
          )
        ) {
          issues.push({
            code:
              "MISSING_COMPONENT_DEPENDENCY",
            message:
              `Component ${component.key} depends on missing component ${dependency}.`,
            componentKey:
              component.key,
            blocking: true,
          });
        }
      }
    }

    const graph =
      this.graphBuilder.build(
        request.components,
      );

    if (graph.hasCycles) {
      issues.push({
        code:
          "DEPENDENCY_CYCLE",
        message:
          `Dependency graph contains ${graph.cycles.length} cycle(s).`,
        blocking: true,
      });
    }

    for (
      const blueprint of
      request.blueprints
    ) {
      if (
        blueprint.required &&
        !blueprint.version.trim()
      ) {
        issues.push({
          code:
            "BLUEPRINT_VERSION_REQUIRED",
          message:
            `Required blueprint ${blueprint.key} must declare a version.`,
          blocking: true,
        });
      }
    }

    return {
      valid:
        !issues.some(
          (issue) =>
            issue.blocking,
        ),
      issues,
      validatedAt:
        new Date().toISOString(),
    };
  }
}
