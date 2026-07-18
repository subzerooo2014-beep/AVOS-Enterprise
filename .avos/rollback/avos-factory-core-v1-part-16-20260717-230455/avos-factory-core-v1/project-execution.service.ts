import { Injectable } from "@nestjs/common";
import { resolve } from "path";
import {
  ProjectExecutionInput,
  ProjectExecutionResult
} from "./project-execution.contracts";
import {
  ProjectExecutionApprovalError
} from "./project-execution.errors";
import {
  ProjectExecutionHistoryService
} from "./project-execution-history.service";
import {
  ProjectFilesystemTransactionService
} from "./project-filesystem-transaction.service";
import {
  ProjectManifestService
} from "./project-manifest.service";
import {
  ProjectVerificationService
} from "./project-verification.service";

@Injectable()
export class ProjectExecutionService {
  constructor(
    private readonly filesystem:
      ProjectFilesystemTransactionService,
    private readonly manifests:
      ProjectManifestService,
    private readonly verification:
      ProjectVerificationService,
    private readonly history:
      ProjectExecutionHistoryService
  ) {}

  async execute(
    input: ProjectExecutionInput
  ): Promise<ProjectExecutionResult> {
    const { plan, options } = input;
    const startedAt = new Date();
    let transactionId = "";
    let targetPath = resolve(
      options.projectRoot,
      plan.outputPath
    );

    this.assertApproval(plan, options);

    this.history.record({
      requestId: plan.requestId,
      planId: plan.id,
      projectId: plan.projectId,
      action: "execution-started",
      status: "generating",
      success: true,
      actor: plan.requestedBy,
      approvedBy: options.approvedBy ?? plan.approvedBy,
      correlationId: options.correlationId,
      details: {
        dryRun: options.dryRun === true,
        overwrite: options.overwrite === true
      }
    });

    try {
      let transaction = await this.filesystem.prepare(
        plan,
        options.projectRoot,
        {
          overwrite: options.overwrite === true,
          dryRun: options.dryRun === true
        }
      );

      transactionId = transaction.id;
      targetPath = transaction.targetPath;

      this.history.record({
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        action: "transaction-prepared",
        status: "generating",
        success: true,
        actor: plan.requestedBy,
        approvedBy: options.approvedBy ?? plan.approvedBy,
        correlationId: options.correlationId,
        details: {
          stagingPath: transaction.stagingPath,
          targetPath: transaction.targetPath
        }
      });

      transaction = await this.filesystem.writeStructure(
        transaction.id,
        plan.structure
      );

      const manifestResult = await this.manifests.createAndWrite(
        plan,
        transaction
      );

      this.history.record({
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        action: "manifest-written",
        status: "generating",
        success: true,
        actor: plan.requestedBy,
        approvedBy: options.approvedBy ?? plan.approvedBy,
        correlationId: options.correlationId,
        details: {
          manifestPath: manifestResult.relativePath
        }
      });

      transaction = await this.filesystem.commit(
        transaction.id
      );

      this.history.record({
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        action: "transaction-committed",
        status: "generating",
        success: true,
        actor: plan.requestedBy,
        approvedBy: options.approvedBy ?? plan.approvedBy,
        correlationId: options.correlationId,
        details: {
          targetPath: transaction.targetPath,
          backupPath: transaction.backupPath
        }
      });

      const verification =
        options.verifyAfterCommit === false
          ? undefined
          : await this.verification.verify(
              plan,
              transaction.targetPath,
              transaction.dryRun
            );

      if (verification && !verification.valid) {
        throw new Error(
          `Project verification failed: ${
            verification.errors
              .map((issue) => issue.code)
              .join(", ")
          }`
        );
      }

      if (verification) {
        this.history.record({
          requestId: plan.requestId,
          planId: plan.id,
          projectId: plan.projectId,
          transactionId,
          action: "verification-completed",
          status: "generating",
          success: verification.valid,
          actor: plan.requestedBy,
          approvedBy: options.approvedBy ?? plan.approvedBy,
          correlationId: options.correlationId,
          details: {
            verifiedArtifacts:
              verification.verifiedArtifacts,
            expectedArtifacts:
              verification.expectedArtifacts,
            warningCount:
              verification.warnings.length
          }
        });
      }

      const completedAt = new Date();

      const result: ProjectExecutionResult = {
        success: true,
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        status: "completed",
        targetPath: transaction.targetPath,
        manifestPath: resolve(
          transaction.targetPath,
          ProjectManifestService.relativeManifestPath
        ),
        generatedPaths: transaction.writes.map(
          (write) => write.relativePath
        ),
        artifactCount: transaction.writes.length,
        verification,
        dryRun: transaction.dryRun,
        warnings: [
          ...plan.warnings,
          ...(verification?.warnings.map(
            (warning) => warning.message
          ) ?? [])
        ],
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          startedAt.getTime()
      };

      this.history.record({
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        action: "execution-completed",
        status: "completed",
        success: true,
        actor: plan.requestedBy,
        approvedBy: options.approvedBy ?? plan.approvedBy,
        correlationId: options.correlationId,
        details: {
          artifactCount: result.artifactCount,
          durationMs: result.durationMs
        }
      });

      return result;
    } catch (error) {
      if (transactionId) {
        try {
          const transaction =
            this.filesystem.get(transactionId);

          if (transaction.status !== "committed") {
            await this.filesystem.rollback(transactionId);
          }
        } catch {
          // The original execution error remains authoritative.
        }
      }

      const completedAt = new Date();
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      this.history.record({
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId:
          transactionId || undefined,
        action: "execution-failed",
        status: "failed",
        success: false,
        actor: plan.requestedBy,
        approvedBy: options.approvedBy ?? plan.approvedBy,
        correlationId: options.correlationId,
        details: {
          error: message
        }
      });

      return {
        success: false,
        requestId: plan.requestId,
        planId: plan.id,
        projectId: plan.projectId,
        transactionId,
        status: "failed",
        targetPath,
        generatedPaths: [],
        artifactCount: 0,
        dryRun: options.dryRun === true,
        warnings: [...plan.warnings],
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          startedAt.getTime(),
        error: message
      };
    }
  }

  private assertApproval(
    plan: ProjectExecutionInput["plan"],
    options: ProjectExecutionInput["options"]
  ): void {
    const destructive =
      options.overwrite === true;

    const approvalRequired =
      destructive ||
      plan.requiresHumanApproval;

    const approved =
      (
        options.humanApproved === true &&
        Boolean(options.approvedBy?.trim())
      ) ||
      (
        plan.humanApproved === true &&
        Boolean(plan.approvedBy?.trim())
      );

    if (approvalRequired && !approved) {
      throw new ProjectExecutionApprovalError(
        destructive
          ? "Project overwrite"
          : "Project generation"
      );
    }
  }
}
