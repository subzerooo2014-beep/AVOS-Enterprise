import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { HashService } from "../infrastructure/hash.service";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { WorkspaceSnapshot } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class SnapshotManagerService {
  constructor(
    private readonly workspaces: WorkspacePersistenceService,
    private readonly repository: PersistentFactoryRepository,
    private readonly hash: HashService,
    private readonly audit: AuditTraceService
  ) {}

  async create(
    workspaceId: string,
    reason = "manual"
  ): Promise<WorkspaceSnapshot> {
    const workspace = this.workspaces.get(workspaceId);
    const id = `snapshot:${Date.now()}:${randomUUID()}`;
    const folder = id.replace(/[^a-zA-Z0-9._-]/g, "_");
    const snapshotPath = path.join(
      this.repository.snapshotRoot,
      workspace.id.replace(/[^a-zA-Z0-9._-]/g, "_"),
      folder
    );

    await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
    await fs.cp(workspace.rootPath, snapshotPath, {
      recursive: true,
      force: true
    });

    const manifest = await this.buildManifest(snapshotPath);
    const snapshot: WorkspaceSnapshot = {
      id,
      workspaceId,
      version: workspace.version,
      sourcePath: workspace.rootPath,
      snapshotPath,
      manifestHash: this.hash.hashJson(manifest),
      createdAt: new Date().toISOString(),
      reason
    };

    await this.repository.saveSnapshot(snapshot);
    await this.workspaces.update(workspace, { activeSnapshotId: snapshot.id });
    await this.audit.record(
      "workspace.snapshot.created",
      { snapshotId: snapshot.id, reason },
      workspaceId
    );

    return snapshot;
  }

  private async buildManifest(
    root: string
  ): Promise<Array<{ path: string; size: number; sha256: string }>> {
    const result: Array<{ path: string; size: number; sha256: string }> = [];

    const walk = async (folder: string): Promise<void> => {
      const entries = await fs.readdir(folder, { withFileTypes: true });
      for (const entry of entries) {
        const absolutePath = path.join(folder, entry.name);
        if (entry.isDirectory()) {
          await walk(absolutePath);
        } else {
          const stats = await fs.stat(absolutePath);
          result.push({
            path: path.relative(root, absolutePath).replace(/\\/g, "/"),
            size: stats.size,
            sha256: await this.hash.hashFile(absolutePath)
          });
        }
      }
    };

    await walk(root);
    return result.sort((a, b) => a.path.localeCompare(b.path));
  }
}