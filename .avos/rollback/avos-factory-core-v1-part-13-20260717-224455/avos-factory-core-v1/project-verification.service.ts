import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { readFile, stat } from "fs/promises";
import { isAbsolute, relative, resolve } from "path";
import {
  ProjectManifest,
  ProjectVerificationIssue,
  ProjectVerificationResult
} from "./project-execution.contracts";
import {
  ProjectGenerationPlan
} from "./project-generator.contracts";
import {
  ProjectManifestService
} from "./project-manifest.service";
import {
  ProjectFilesystemBoundaryError
} from "./project-execution.errors";

@Injectable()
export class ProjectVerificationService {
  async verify(
    plan: ProjectGenerationPlan,
    targetPath: string,
    dryRun = false
  ): Promise<ProjectVerificationResult> {
    const errors: ProjectVerificationIssue[] = [];
    const warnings: ProjectVerificationIssue[] = [];

    if (dryRun) {
      return {
        valid: true,
        projectId: plan.projectId,
        targetPath,
        manifestFound: true,
        expectedArtifacts: plan.structure.length,
        verifiedArtifacts: plan.structure.length,
        errors,
        warnings: [{
          code: "PROJECT_DRY_RUN_VERIFICATION",
          message: "Verification used the in-memory dry-run plan.",
          severity: "warning"
        }],
        verifiedAt: new Date().toISOString()
      };
    }

    let manifest: ProjectManifest | undefined;
    const manifestPath = this.resolveInside(
      targetPath,
      ProjectManifestService.relativeManifestPath
    );

    try {
      const content = await readFile(manifestPath, "utf8");
      manifest = JSON.parse(content) as ProjectManifest;
    } catch {
      errors.push({
        code: "PROJECT_MANIFEST_MISSING_OR_INVALID",
        message: "Project manifest is missing or invalid.",
        relativePath: ProjectManifestService.relativeManifestPath,
        severity: "error"
      });
    }

    let verifiedArtifacts = 0;

    for (const node of plan.structure) {
      const artifactPath = this.resolveInside(
        targetPath,
        node.relativePath
      );

      try {
        const info = await stat(artifactPath);

        if (node.kind === "directory" && !info.isDirectory()) {
          errors.push({
            code: "PROJECT_EXPECTED_DIRECTORY",
            message: "Expected a directory but found another artifact type.",
            relativePath: node.relativePath,
            severity: "error"
          });
          continue;
        }

        if (node.kind !== "directory" && !info.isFile()) {
          errors.push({
            code: "PROJECT_EXPECTED_FILE",
            message: "Expected a file but found another artifact type.",
            relativePath: node.relativePath,
            severity: "error"
          });
          continue;
        }

        if (node.kind !== "directory" && manifest) {
          const manifestArtifact = manifest.artifacts.find(
            (artifact) =>
              artifact.relativePath ===
              node.relativePath.replace(/\\/g, "/")
          );

          if (!manifestArtifact) {
            warnings.push({
              code: "PROJECT_ARTIFACT_NOT_IN_MANIFEST",
              message: "Generated artifact is not represented in the manifest.",
              relativePath: node.relativePath,
              severity: "warning"
            });
          } else {
            const content = await readFile(artifactPath);
            const checksum = createHash("sha256")
              .update(content)
              .digest("hex");

            if (checksum !== manifestArtifact.checksum) {
              errors.push({
                code: "PROJECT_ARTIFACT_CHECKSUM_MISMATCH",
                message: "Generated artifact checksum does not match the manifest.",
                relativePath: node.relativePath,
                severity: "error"
              });
              continue;
            }
          }
        }

        verifiedArtifacts += 1;
      } catch {
        errors.push({
          code: "PROJECT_ARTIFACT_MISSING",
          message: "Expected project artifact was not found.",
          relativePath: node.relativePath,
          severity: "error"
        });
      }
    }

    if (manifest) {
      if (manifest.projectId !== plan.projectId) {
        errors.push({
          code: "PROJECT_MANIFEST_ID_MISMATCH",
          message: "Manifest projectId does not match the generation plan.",
          relativePath: ProjectManifestService.relativeManifestPath,
          severity: "error"
        });
      }

      if (manifest.humanFinalAuthority !== true) {
        errors.push({
          code: "PROJECT_HUMAN_AUTHORITY_MISSING",
          message: "Manifest does not preserve Human Final Authority.",
          relativePath: ProjectManifestService.relativeManifestPath,
          severity: "error"
        });
      }
    }

    return {
      valid: errors.length === 0,
      projectId: plan.projectId,
      targetPath,
      manifestFound: Boolean(manifest),
      expectedArtifacts: plan.structure.length,
      verifiedArtifacts,
      errors,
      warnings,
      verifiedAt: new Date().toISOString()
    };
  }

  private resolveInside(root: string, value: string): string {
    if (isAbsolute(value)) {
      throw new ProjectFilesystemBoundaryError(value);
    }

    const resolvedRoot = resolve(root);
    const candidate = resolve(resolvedRoot, value);
    const relation = relative(resolvedRoot, candidate);

    if (
      relation === ".." ||
      relation.startsWith(`..\\`) ||
      relation.startsWith("../") ||
      isAbsolute(relation)
    ) {
      throw new ProjectFilesystemBoundaryError(value);
    }

    return candidate;
  }
}
