import { Injectable } from "@nestjs/common";
import {
  FactoryGeneratedFile,
  FactoryValidationIssue,
  FactoryValidationReport,
} from "../contracts/generation.contracts";

@Injectable()
export class FactoryGenerationValidatorService {
  validate(files: FactoryGeneratedFile[]): FactoryValidationReport {
    const issues: FactoryValidationIssue[] = [];

    if (!files.length) {
      issues.push({
        code: "NO_FILES",
        severity: "error",
        message: "No files were generated.",
      });
    }

    const paths = new Set<string>();

    for (const file of files) {
      const normalized = file.relativePath.replace(/\\/g, "/").toLowerCase();

      if (paths.has(normalized)) {
        issues.push({
          code: "DUPLICATE_PATH",
          severity: "error",
          message: `Duplicate generated path '${file.relativePath}'.`,
          file: file.relativePath,
        });
      }
      paths.add(normalized);

      if (!file.content.trim()) {
        issues.push({
          code: "EMPTY_CONTENT",
          severity: "warning",
          message: `Generated file '${file.relativePath}' is empty.`,
          file: file.relativePath,
        });
      }

      if (file.relativePath.includes("../")) {
        issues.push({
          code: "PATH_TRAVERSAL",
          severity: "error",
          message: `Unsafe path '${file.relativePath}'.`,
          file: file.relativePath,
        });
      }

      if (
        file.artifactType === "source" &&
        file.relativePath.endsWith(".ts") &&
        file.content.includes("{{")
      ) {
        issues.push({
          code: "UNRESOLVED_TEMPLATE_VARIABLE",
          severity: "error",
          message: `Unresolved template variable in '${file.relativePath}'.`,
          file: file.relativePath,
        });
      }
    }

    const errors = issues.filter((issue) => issue.severity === "error").length;
    const warnings = issues.filter((issue) => issue.severity === "warning").length;
    const score = Math.max(0, 100 - errors * 25 - warnings * 5);

    return {
      valid: errors === 0,
      score,
      issues,
      checkedAt: new Date().toISOString(),
    };
  }
}
