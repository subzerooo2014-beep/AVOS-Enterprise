import { Injectable } from "@nestjs/common";
import {
  GenesisBlueprint,
  GenesisValidationIssue,
  GenesisValidationResult,
} from "../types/genesis-platform.types";

@Injectable()
export class BlueprintValidatorService {
  validate(blueprint: GenesisBlueprint): GenesisValidationResult {
    const issues: GenesisValidationIssue[] = [];

    if (!blueprint.id) {
      issues.push({
        code: "BLUEPRINT_ID_REQUIRED",
        severity: "error",
        message: "Blueprint id is required.",
      });
    }

    if (!blueprint.name) {
      issues.push({
        code: "BLUEPRINT_NAME_REQUIRED",
        severity: "error",
        message: "Blueprint name is required.",
      });
    }

    if (!blueprint.version) {
      issues.push({
        code: "BLUEPRINT_VERSION_REQUIRED",
        severity: "error",
        message: "Blueprint version is required.",
      });
    }

    const paths = new Set<string>();
    for (const artifact of blueprint.artifacts) {
      if (!artifact.path) {
        issues.push({
          code: "ARTIFACT_PATH_REQUIRED",
          severity: "error",
          message: `Artifact ${artifact.id} has no path.`,
          artifactId: artifact.id,
        });
      }

      if (paths.has(artifact.path)) {
        issues.push({
          code: "DUPLICATE_ARTIFACT_PATH",
          severity: "error",
          message: `Duplicate artifact path: ${artifact.path}`,
          artifactId: artifact.id,
        });
      }
      paths.add(artifact.path);
    }

    const errorCount = issues.filter((item) => item.severity === "error").length;
    const warningCount = issues.filter(
      (item) => item.severity === "warning",
    ).length;
    const score = Math.max(0, 100 - errorCount * 25 - warningCount * 5);

    return {
      valid: errorCount === 0,
      score,
      issues,
      checkedAt: new Date().toISOString(),
    };
  }
}
