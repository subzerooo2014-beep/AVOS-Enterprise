import {
  CodeGenPlanningContext,
  CodeGenPlanningDiagnostic,
  CodeGenPlanningPolicy,
} from "../contracts/codegen-planning.contracts";

export class CodeGenPlanningValidator {
  validate(
    context:
      CodeGenPlanningContext,
  ): CodeGenPlanningDiagnostic[] {
    const diagnostics:
      CodeGenPlanningDiagnostic[] = [];

    const keys =
      context.artifacts.map(
        (artifact) =>
          artifact.key,
      );

    const duplicates =
      keys.filter(
        (key, index) =>
          keys.indexOf(key) !==
          index,
      );

    for (
      const duplicate of
      Array.from(
        new Set(duplicates),
      )
    ) {
      diagnostics.push({
        code:
          "DUPLICATE_ARTIFACT_KEY",
        message:
          `Duplicate artifact key: ${duplicate}`,
        severity:
          "error",
        artifactKey:
          duplicate,
      });
    }

    for (
      const artifact of
      context.artifacts
    ) {
      if (
        artifact.dependencies.includes(
          artifact.key,
        )
      ) {
        diagnostics.push({
          code:
            "SELF_DEPENDENCY",
          message:
            `Artifact cannot depend on itself: ${artifact.key}`,
          severity:
            "error",
          artifactKey:
            artifact.key,
        });
      }

      for (
        const dependencyKey of
        artifact.dependencies
      ) {
        if (
          !keys.includes(
            dependencyKey,
          )
        ) {
          diagnostics.push({
            code:
              "MISSING_DEPENDENCY",
            message:
              `Artifact dependency was not found: ${artifact.key} -> ${dependencyKey}`,
            severity:
              context.policy ===
              CodeGenPlanningPolicy.BEST_EFFORT
                ? "warning"
                : "error",
            artifactKey:
              artifact.key,
          });
        }
      }

      if (
        !artifact.relativePath.trim()
      ) {
        diagnostics.push({
          code:
            "EMPTY_ARTIFACT_PATH",
          message:
            `Artifact path is required: ${artifact.key}`,
          severity:
            "error",
          artifactKey:
            artifact.key,
        });
      }
    }

    if (
      context.artifacts.length === 0
    ) {
      diagnostics.push({
        code:
          "NO_ARTIFACTS",
        message:
          "Planning context has no artifacts",
        severity:
          "warning",
      });
    }

    return diagnostics;
  }
}
