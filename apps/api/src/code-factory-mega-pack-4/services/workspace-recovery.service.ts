import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { promises as fs } from "node:fs";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { WorkspaceMetadata } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class WorkspaceRecoveryService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly audit: AuditTraceService
  ) {}

  async restore(
    workspaceId: string,
    options: {
      checkpointId?: string;
      snapshotId?: string;
      approvedByHuman?: boolean;
      approvedBy?: string;
    }
  ): Promise<WorkspaceMetadata> {
    if (!options.approvedByHuman) {
      throw new BadRequestException(
        "Human approval is required before workspace restore."
      );
    }

    let workspace = this.workspaces.get(workspaceId);
    const checkpoint = options.checkpointId
      ? this.repository
          .listCheckpoints(workspaceId)
          .find((item) => item.id === options.checkpointId)
      : undefined;

    const snapshotId =
      options.snapshotId ??
      checkpoint?.snapshotId ??
      workspace.activeSnapshotId;

    if (!snapshotId) {
      throw new NotFoundException("No snapshot is available for recovery.");
    }

    const snapshot = this.repository
      .listSnapshots(workspaceId)
      .find((item) => item.id === snapshotId);

    if (!snapshot) {
      throw new NotFoundException(`Snapshot not found: ${snapshotId}`);
    }

    workspace = await this.workspaces.update(workspace, {
      status: "recovering"
    });

    await fs.rm(workspace.rootPath, { recursive: true, force: true });
    await fs.mkdir(workspace.rootPath, { recursive: true });
    await fs.cp(snapshot.snapshotPath, workspace.rootPath, {
      recursive: true,
      force: true
    });

    workspace = await this.workspaces.update(workspace, {
      status: "restored",
      version: Math.max(workspace.version, snapshot.version) + 1,
      activeSnapshotId: snapshot.id,
      lastRecoveredAt: new Date().toISOString()
    });

    await this.audit.record(
      "workspace.restored",
      {
        snapshotId: snapshot.id,
        checkpointId: checkpoint?.id,
        approvedBy: options.approvedBy ?? "human:unknown"
      },
      workspaceId,
      options.approvedBy ?? "human:unknown"
    );

    return workspace;
  }

  async recoverInterruptedWorkspaces(): Promise<WorkspaceMetadata[]> {
    const recoverable = this.repository
      .listWorkspaces()
      .filter((item) =>
        ["saving", "materializing", "recovering", "failed"].includes(item.status)
      );

    const recovered: WorkspaceMetadata[] = [];

    for (const workspace of recoverable) {
      const checkpoint = this.repository
        .listCheckpoints(workspace.id)
        .filter((item) => item.safe)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

      if (!checkpoint) {
        await this.workspaces.update(workspace, { status: "degraded" });
        continue;
      }

      recovered.push(
        await this.restore(workspace.id, {
          checkpointId: checkpoint.id,
          approvedByHuman: true,
          approvedBy: "system:auto-recovery-policy"
        })
      );
    }

    return recovered;
  }
}