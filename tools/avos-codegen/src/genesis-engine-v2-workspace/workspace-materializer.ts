import path from "node:path";
import {
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { randomUUID } from "node:crypto";
import {
  WorkspaceArtifactInput,
  WorkspaceEvidence,
  WorkspaceExecutionMode,
  WorkspaceExecutionStatus,
  WorkspaceFinding,
  WorkspaceOperationResult,
  WorkspaceSeverity,
} from "./contracts";
import { WorkspacePathGuard } from "./path-guard";
import { WorkspaceHashVerifier } from "./hash-verifier";
import {
  RollbackManifestEntry,
  RollbackManifestFactory,
  WorkspaceRollbackManifest,
} from "./rollback-manifest";

export interface WorkspaceMaterializationInput {
  rootDirectory: string;
  artifacts: WorkspaceArtifactInput[];
  mode: WorkspaceExecutionMode;
}

export interface WorkspaceMaterializationResult {
  success: boolean;
  status: WorkspaceExecutionStatus;
  mode: WorkspaceExecutionMode;
  operations: WorkspaceOperationResult[];
  rollbackManifest: WorkspaceRollbackManifest;
  findings: WorkspaceFinding[];
  evidence: WorkspaceEvidence[];
  completedAt: string;
}

export class WorkspaceMaterializer {
  constructor(
    readonly guard = new WorkspacePathGuard(),
    readonly verifier = new WorkspaceHashVerifier(),
    readonly rollbackFactory = new RollbackManifestFactory(),
  ) {}

  async execute(
    input: WorkspaceMaterializationInput,
  ): Promise<WorkspaceMaterializationResult> {
    const operations: WorkspaceOperationResult[] = [];
    const findings: WorkspaceFinding[] = [];
    const rollbackEntries: RollbackManifestEntry[] = [];

    for (const artifact of input.artifacts) {
      let absolutePath = "";

      try {
        absolutePath = this.guard.resolveSafe(
          input.rootDirectory,
          artifact.relativePath,
        );

        let exists = false;
        let previousContent: string | null = null;
        let previousHash: string | null = null;

        try {
          await stat(absolutePath);
          exists = true;
          previousContent = await readFile(absolutePath, "utf8");
          previousHash = this.verifier.hashContent(previousContent);
        } catch {
          exists = false;
        }

        if (exists && !artifact.overwrite) {
          operations.push({
            relativePath: artifact.relativePath,
            absolutePath,
            action: "skip",
            success: true,
            verified: previousHash === artifact.hash,
            previousHash,
            currentHash: previousHash,
            message: "Existing file preserved because overwrite is disabled.",
          });
          continue;
        }

        const action = exists ? "overwrite" : "create";

        if (input.mode === WorkspaceExecutionMode.DRY_RUN) {
          operations.push({
            relativePath: artifact.relativePath,
            absolutePath,
            action,
            success: true,
            verified: true,
            previousHash,
            currentHash: artifact.hash,
            message: "Dry run operation planned.",
          });

          rollbackEntries.push({
            relativePath: artifact.relativePath,
            action: exists ? "restore-overwritten" : "delete-created",
            previousContent,
            previousHash,
          });
          continue;
        }

        await mkdir(path.dirname(absolutePath), { recursive: true });

        const temporaryPath = `${absolutePath}.avos-tmp-${randomUUID()}`;
        await writeFile(temporaryPath, artifact.content, "utf8");
        await rename(temporaryPath, absolutePath);

        const currentHash = await this.verifier.hashFile(absolutePath);
        const verified = currentHash === artifact.hash;

        if (!verified) {
          findings.push({
            code: "WORKSPACE_POST_WRITE_HASH_MISMATCH",
            severity: WorkspaceSeverity.CRITICAL,
            message: "Written file hash does not match the generated artifact hash.",
            subject: artifact.relativePath,
            metadata: {
              expectedHash: artifact.hash,
              currentHash,
            },
          });
        }

        rollbackEntries.push({
          relativePath: artifact.relativePath,
          action: exists ? "restore-overwritten" : "delete-created",
          previousContent,
          previousHash,
        });

        operations.push({
          relativePath: artifact.relativePath,
          absolutePath,
          action,
          success: verified,
          verified,
          previousHash,
          currentHash,
          message: verified
            ? "File written and verified."
            : "File written but verification failed.",
        });
      } catch (error) {
        findings.push({
          code: "WORKSPACE_OPERATION_FAILED",
          severity: WorkspaceSeverity.ERROR,
          message:
            error instanceof Error
              ? error.message
              : "Unknown workspace operation failure.",
          subject: artifact.relativePath,
          metadata: { absolutePath },
        });

        operations.push({
          relativePath: artifact.relativePath,
          absolutePath,
          action: "skip",
          success: false,
          verified: false,
          previousHash: null,
          currentHash: null,
          message: "Workspace operation failed.",
        });
      }
    }

    const rollbackManifest = this.rollbackFactory.create(
      input.rootDirectory,
      rollbackEntries,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === WorkspaceSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === WorkspaceSeverity.ERROR,
    );

    const status = hasCritical
      ? WorkspaceExecutionStatus.BLOCKED
      : hasErrors
        ? WorkspaceExecutionStatus.DEGRADED
        : WorkspaceExecutionStatus.READY;

    return {
      success: status === WorkspaceExecutionStatus.READY,
      status,
      mode: input.mode,
      operations,
      rollbackManifest,
      findings,
      evidence: [
        {
          id: randomUUID(),
          category: "genesis-engine-v2-workspace",
          action: "workspace.materialized",
          message: `Workspace execution completed in ${input.mode} mode.`,
          metadata: {
            rootDirectory: input.rootDirectory,
            artifacts: input.artifacts.length,
            operations: operations.length,
            successfulOperations: operations.filter((item) => item.success).length,
            verifiedOperations: operations.filter((item) => item.verified).length,
            rollbackEntries: rollbackEntries.length,
            status,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }

  async rollback(
    manifest: WorkspaceRollbackManifest,
  ): Promise<WorkspaceOperationResult[]> {
    const results: WorkspaceOperationResult[] = [];

    for (const entry of [...manifest.entries].reverse()) {
      const absolutePath = this.guard.resolveSafe(
        manifest.rootDirectory,
        entry.relativePath,
      );

      if (entry.action === "delete-created") {
        try {
          await unlink(absolutePath);
          results.push({
            relativePath: entry.relativePath,
            absolutePath,
            action: "overwrite",
            success: true,
            verified: true,
            previousHash: null,
            currentHash: null,
            message: "Created file removed during rollback.",
          });
        } catch {
          results.push({
            relativePath: entry.relativePath,
            absolutePath,
            action: "skip",
            success: true,
            verified: true,
            previousHash: null,
            currentHash: null,
            message: "Created file was already absent.",
          });
        }

        continue;
      }

      if (entry.previousContent === null) {
        continue;
      }

      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, entry.previousContent, "utf8");
      const currentHash = await this.verifier.hashFile(absolutePath);

      results.push({
        relativePath: entry.relativePath,
        absolutePath,
        action: "overwrite",
        success: currentHash === entry.previousHash,
        verified: currentHash === entry.previousHash,
        previousHash: entry.previousHash,
        currentHash,
        message: "Previous file content restored.",
      });
    }

    return results;
  }
}
