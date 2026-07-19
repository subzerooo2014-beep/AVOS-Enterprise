import { Injectable } from "@nestjs/common";
import {
  QualityFinding,
  QualityReport,
} from "../contracts/autonomous-factory.contracts";
import { FactoryGenerationPackageService } from "../generation/package.service";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryCodeQualityEngineService {
  constructor(
    private readonly packages: FactoryGenerationPackageService,
  ) {}

  analyze(packageId: string): QualityReport {
    const generationPackage = this.packages.get(packageId);

    if (!generationPackage) {
      throw new Error(`Generation package '${packageId}' was not found.`);
    }

    const findings: QualityFinding[] = [];
    const paths = generationPackage.files.map((file) => file.relativePath);
    const duplicatePaths = paths.filter(
      (path, index) => paths.indexOf(path) !== index,
    );

    if (duplicatePaths.length) {
      findings.push({
        code: "duplicate-path",
        severity: "error",
        message: `Duplicate paths detected: ${[
          ...new Set(duplicatePaths),
        ].join(", ")}`,
      });
    }

    for (const file of generationPackage.files) {
      if (!file.content.trim()) {
        findings.push({
          code: "empty-file",
          severity: "error",
          message: "Generated file is empty.",
          file: file.relativePath,
        });
      }

      if (
        file.artifactType === "source" &&
        file.content.includes(": any")
      ) {
        findings.push({
          code: "explicit-any",
          severity: "warning",
          message: "Explicit any type detected.",
          file: file.relativePath,
        });
      }

      if (
        file.relativePath.endsWith(".ts") &&
        file.content.includes("console.log(")
      ) {
        findings.push({
          code: "console-log",
          severity: "warning",
          message: "console.log detected in generated source.",
          file: file.relativePath,
        });
      }

      if (
        file.relativePath.endsWith(".controller.ts") &&
        !file.content.includes("@Controller")
      ) {
        findings.push({
          code: "invalid-controller",
          severity: "error",
          message: "Controller file does not contain @Controller.",
          file: file.relativePath,
        });
      }
    }

    const checks: Record<string, boolean> = {
      generationValidationPassed:
        generationPackage.validation.valid,
      nonEmptyPackage: generationPackage.files.length > 0,
      uniquePaths: duplicatePaths.length === 0,
      checksumsPresent: generationPackage.files.every(
        (file) => Boolean(file.checksum),
      ),
      humanFinalAuthorityPreserved:
        generationPackage.manifest.humanFinalAuthority === true,
      manifestPresent: Boolean(generationPackage.manifest),
      noErrorFindings:
        findings.every((finding) => finding.severity !== "error"),
    };

    const failedChecks = Object.values(checks).filter(
      (value) => !value,
    ).length;
    const warningCount = findings.filter(
      (finding) => finding.severity === "warning",
    ).length;

    const score = Math.max(
      0,
      100 - failedChecks * 20 - warningCount * 3,
    );

    return {
      id: createFactoryId("factory-quality-report"),
      packageId,
      passed: Object.values(checks).every(Boolean),
      score,
      checks,
      findings,
      checkedAt: new Date().toISOString(),
    };
  }
}
