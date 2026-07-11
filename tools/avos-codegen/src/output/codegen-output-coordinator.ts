import {
  resolve,
} from "node:path";
import {
  CodeGenArtifactDescriptor,
} from "../artifacts/codegen-artifact.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";
import {
  CodeGenAtomicFileWriter,
} from "./atomic/codegen-atomic-file-writer";
import {
  CodeGenOutputConflictDetector,
} from "./conflicts/codegen-output-conflict-detector";
import {
  CodeGenOutputIntegrityVerifier,
} from "./integrity/codegen-output-integrity-verifier";
import {
  CodeGenWorkspaceLockManager,
} from "./locking/codegen-workspace-lock-manager";
import {
  CodeGenOutputManifestEngine,
} from "./manifests/codegen-output-manifest-engine";
import {
  CodeGenGenerationReportEngine,
} from "./reports/codegen-generation-report-engine";
import {
  CodeGenConflictPolicy,
  CodeGenGenerationReport,
  CodeGenOutputManifestEntry,
} from "./codegen-output.contracts";

export class CodeGenOutputCoordinator {
  constructor(
    readonly writer =
      new CodeGenAtomicFileWriter(),
    readonly conflicts =
      new CodeGenOutputConflictDetector(),
    readonly locks =
      new CodeGenWorkspaceLockManager(),
    readonly manifests =
      new CodeGenOutputManifestEngine(),
    readonly integrity =
      new CodeGenOutputIntegrityVerifier(),
    readonly reports =
      new CodeGenGenerationReportEngine(),
  ) {}

  async execute(
    input: {
      sessionId: string;
      workspaceRoot: string;
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      dryRun: boolean;
      conflictPolicy:
        CodeGenConflictPolicy;
    },
  ): Promise<{
    manifest:
      ReturnType<
        CodeGenOutputManifestEngine["create"]
      >;
    report:
      CodeGenGenerationReport;
  }> {
    const started =
      Date.now();

    const startedAt =
      new Date(
        started,
      ).toISOString();

    const warnings: string[] = [];
    const errors: string[] = [];
    const entries:
      CodeGenOutputManifestEntry[] = [];

    const lock =
      await this.locks.acquire(
        input.workspaceRoot,
      );

    try {
      for (
        const artifact of
        input.artifacts
      ) {
        const absolutePath =
          resolve(
            input.targetRoot,
            artifact.relativePath,
          );

        const conflict =
          await this.conflicts.detect({
            artifactKey:
              artifact.key,
            targetRoot:
              input.targetRoot,
            absolutePath,
            content:
              artifact.content,
            policy:
              input.conflictPolicy,
          });

        if (!conflict.allowed) {
          errors.push(
            `${artifact.key}: ${conflict.reason}`,
          );

          throw new CodeGenValidationError(
            `Output conflict for ${artifact.key}: ${conflict.reason}`,
          );
        }

        if (
          conflict.type !== "none" &&
          input.conflictPolicy ===
            CodeGenConflictPolicy.SKIP
        ) {
          entries.push({
            artifactKey:
              artifact.key,
            relativePath:
              artifact.relativePath,
            absolutePath,
            checksum:
              conflict.existingFingerprint
                ?.checksum ?? "",
            bytes:
              conflict.existingFingerprint
                ?.sizeBytes ?? 0,
            status:
              input.dryRun
                ? "preview"
                : "skipped",
            generatedAt:
              new Date().toISOString(),
          });

          warnings.push(
            `Skipped existing artifact: ${artifact.key}`,
          );

          continue;
        }

        if (input.dryRun) {
          entries.push({
            artifactKey:
              artifact.key,
            relativePath:
              artifact.relativePath,
            absolutePath,
            checksum:
              conflict.expectedFingerprint
                ?.checksum ?? "",
            bytes:
              conflict.expectedFingerprint
                ?.sizeBytes ?? 0,
            status:
              "preview",
            generatedAt:
              new Date().toISOString(),
          });

          continue;
        }

        const result =
          await this.writer.write({
            absolutePath,
            content:
              artifact.content,
          });

        entries.push({
          artifactKey:
            artifact.key,
          relativePath:
            artifact.relativePath,
          absolutePath,
          checksum:
            result.checksum,
          bytes:
            result.bytes,
          status:
            "written",
          generatedAt:
            result.writtenAt,
        });
      }

      const manifest =
        this.manifests.create({
          sessionId:
            input.sessionId,
          workspaceRoot:
            input.workspaceRoot,
          targetRoot:
            input.targetRoot,
          entries,
        });

      let manifestPath:
        string | undefined;

      let integrityValid = true;

      if (!input.dryRun) {
        manifestPath =
          await this.manifests.write(
            manifest,
          );

        const integrity =
          await this.integrity.verify(
            manifest,
          );

        integrityValid =
          integrity.valid;

        if (!integrity.valid) {
          errors.push(
            "Output integrity verification failed",
          );
        }
      }

      const completed =
        Date.now();

      const report:
        CodeGenGenerationReport = {
        sessionId:
          input.sessionId,
        success:
          errors.length === 0 &&
          integrityValid,
        dryRun:
          input.dryRun,
        artifacts:
          input.artifacts.length,
        written:
          entries.filter(
            (entry) =>
              entry.status ===
              "written",
          ).length,
        skipped:
          entries.filter(
            (entry) =>
              entry.status ===
              "skipped",
          ).length,
        conflicts:
          warnings.filter(
            (warning) =>
              warning.includes(
                "Skipped",
              ),
          ).length,
        integrityValid,
        ...(manifestPath
          ? {
              manifestPath,
            }
          : {}),
        startedAt,
        completedAt:
          new Date(
            completed,
          ).toISOString(),
        durationMs:
          completed - started,
        warnings,
        errors,
      };

      if (!input.dryRun) {
        const reportPath =
          await this.reports.write(
            report,
            input.targetRoot,
          );

        report.reportPath =
          reportPath;
      }

      return {
        manifest,
        report,
      };
    } finally {
      await this.locks.release(
        lock,
      );
    }
  }
}
