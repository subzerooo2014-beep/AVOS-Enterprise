import {
  CodeGenCompatibilityRequest,
  CodeGenCompatibilityResult,
} from "../contracts/codegen-validation.contracts";

export class CodeGenVersionCompatibilityEngine {
  check(
    request:
      CodeGenCompatibilityRequest,
  ): CodeGenCompatibilityResult {
    const sourceMajor =
      this.major(
        request.sourceVersion,
      );

    const targetMajor =
      this.major(
        request.targetVersion,
      );

    const missingCapabilities =
      request.requiredCapabilities
        .filter(
          (capability) =>
            !request.availableCapabilities.includes(
              capability,
            ),
        );

    const versionCompatible =
      sourceMajor ===
      targetMajor;

    const warnings: string[] = [];

    if (!versionCompatible) {
      warnings.push(
        `Major version mismatch: ${request.sourceVersion} -> ${request.targetVersion}`,
      );
    }

    if (
      missingCapabilities.length >
      0
    ) {
      warnings.push(
        `Missing capabilities: ${missingCapabilities.join(", ")}`,
      );
    }

    return {
      compatible:
        versionCompatible &&
        missingCapabilities.length ===
        0,
      missingCapabilities,
      versionCompatible,
      warnings,
      checkedAt:
        new Date().toISOString(),
    };
  }

  private major(
    version: string,
  ): number {
    const first =
      version
        .split(".")[0];

    const parsed =
      Number(first);

    return Number.isFinite(
      parsed,
    )
      ? parsed
      : 0;
  }
}
