import { Injectable } from "@nestjs/common";
import {
  ProjectRollbackRequest,
  ProjectRollbackResult
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

@Injectable()
export class ProjectRollbackEngineService {
  constructor(
    private readonly filesystem:
      ProjectFilesystemTransactionService,
    private readonly history:
      ProjectExecutionHistoryService
  ) {}

  async rollback(
    request: ProjectRollbackRequest
  ): Promise<ProjectRollbackResult> {
    if (
      request.humanApproved !== true ||
      !request.approvedBy?.trim()
    ) {
      throw new ProjectExecutionApprovalError(
        "Project rollback"
      );
    }

    if (!request.reason?.trim()) {
      throw new Error(
        "A rollback reason is required for auditability."
      );
    }

    const before = this.filesystem.get(request.transactionId);
    const restoredBackup = Boolean(before.backupPath);

    const transaction = await this.filesystem.rollback(
      request.transactionId
    );

    this.history.record({
      requestId: transaction.planId,
      planId: transaction.planId,
      projectId: transaction.projectId,
      transactionId: transaction.id,
      action: "rollback-completed",
      status: "rolled-back",
      success: true,
      actor: request.requestedBy,
      approvedBy: request.approvedBy,
      details: {
        reason: request.reason,
        restoredBackup
      }
    });

    return {
      success: true,
      transactionId: transaction.id,
      projectId: transaction.projectId,
      targetPath: transaction.targetPath,
      restoredBackup,
      rolledBackAt:
        transaction.rolledBackAt ??
        new Date().toISOString(),
      approvedBy: request.approvedBy,
      reason: request.reason
    };
  }
}
