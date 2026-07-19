import { Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import { HashService } from "../infrastructure/hash.service";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { AuditTraceService } from "./audit-trace.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class SynchronizationService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly hash: HashService,
    private readonly audit: AuditTraceService
  ) {}

  async synchronize(workspaceId: string): Promise<{
    workspaceId: string;
    status: "synchronized" | "conflicted";
    checked: number;
    conflicts: Array<{
      relativePath: string;
      expected: string;
      actual?: string;
      reason: string;
    }>;
  }> {
    const workspace = this.workspaces.get(workspaceId);
    const artifacts = this.repository.listArtifacts(workspaceId);
    const conflicts: Array<{
      relativePath: string;
      expected: string;
      actual?: string;
      reason: string;
    }> = [];

    for (const artifact of artifacts) {
      try {
        const actual = await this.hash.hashFile(artifact.absolutePath);
        if (actual !== artifact.sha256) {
          conflicts.push({
            relativePath: artifact.relativePath,
            expected: artifact.sha256,
            actual,
            reason: "hash-mismatch"
          });
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          conflicts.push({
            relativePath: artifact.relativePath,
            expected: artifact.sha256,
            reason: "missing-file"
          });
        } else {
          throw error;
        }
      }
    }

    const status = conflicts.length === 0 ? "synchronized" : "conflicted";
    await this.workspaces.update(workspace, { status });
    await this.audit.record(
      "workspace.synchronization.completed",
      { checked: artifacts.length, conflicts: conflicts.length },
      workspaceId
    );

    await fs.mkdir(workspace.rootPath, { recursive: true });

    return {
      workspaceId,
      status,
      checked: artifacts.length,
      conflicts
    };
  }
}