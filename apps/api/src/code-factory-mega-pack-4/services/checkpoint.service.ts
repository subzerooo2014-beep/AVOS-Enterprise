import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { WorkspaceCheckpoint } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { SnapshotManagerService } from "./snapshot-manager.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class CheckpointService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly snapshots: SnapshotManagerService,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly audit: AuditTraceService
  ) {}

  async create(
    workspaceId: string,
    label: string,
    createdBy = "human:khalifa"
  ): Promise<WorkspaceCheckpoint> {
    const workspace = this.workspaces.get(workspaceId);
    const snapshot = await this.snapshots.create(
      workspaceId,
      `checkpoint:${label}`
    );

    const checkpoint: WorkspaceCheckpoint = {
      id: `checkpoint:${Date.now()}:${randomUUID()}`,
      workspaceId,
      snapshotId: snapshot.id,
      version: workspace.version,
      label,
      createdAt: new Date().toISOString(),
      createdBy,
      safe: true
    };

    await this.repository.saveCheckpoint(checkpoint);
    await this.workspaces.update(workspace, {
      status: "checkpointed",
      latestCheckpointId: checkpoint.id
    });
    await this.audit.record(
      "workspace.checkpoint.created",
      { checkpointId: checkpoint.id, label, createdBy },
      workspaceId,
      createdBy
    );

    return checkpoint;
  }
}