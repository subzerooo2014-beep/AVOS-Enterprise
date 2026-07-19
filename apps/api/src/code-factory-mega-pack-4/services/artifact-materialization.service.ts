import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { MaterializeWorkspaceDto } from "../dto/materialize-workspace.dto";
import { AtomicFileWriterService } from "../infrastructure/atomic-file-writer.service";
import { HashService } from "../infrastructure/hash.service";
import { PathSafetyService } from "../infrastructure/path-safety.service";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import {
  MaterializedArtifact,
  WorkspaceMetadata
} from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class ArtifactMaterializationService {
  constructor(
    private readonly workspaces: WorkspacePersistenceService,
    private readonly repository: PersistentFactoryRepository,
    private readonly pathSafety: PathSafetyService,
    private readonly writer: AtomicFileWriterService,
    private readonly hash: HashService,
    private readonly audit: AuditTraceService
  ) {}

  async materialize(
    workspaceId: string,
    dto: MaterializeWorkspaceDto
  ): Promise<{
    workspace: WorkspaceMetadata;
    artifacts: MaterializedArtifact[];
  }> {
    let workspace = this.workspaces.get(workspaceId);
    workspace = await this.workspaces.update(workspace, {
      status: "materializing"
    });

    const artifacts: MaterializedArtifact[] = [];

    try {
      for (const file of dto.files) {
        const absolutePath = this.pathSafety.resolveInside(
          workspace.rootPath,
          file.relativePath
        );

        await this.writer.writeText(absolutePath, file.content);

        if (file.executable && process.platform !== "win32") {
          await fs.chmod(absolutePath, 0o755);
        }

        const stats = await fs.stat(absolutePath);
        const sha256 = await this.hash.hashFile(absolutePath);
        const existing = this.repository
          .listArtifacts(workspaceId)
          .find((item) => item.relativePath === file.relativePath);

        artifacts.push({
          id: existing?.id ?? `artifact:${Date.now()}:${randomUUID()}`,
          workspaceId,
          relativePath: file.relativePath.replace(/\\/g, "/"),
          absolutePath,
          sha256,
          size: stats.size,
          version: (existing?.version ?? 0) + 1,
          createdAt: existing?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.repository.saveArtifacts(artifacts);
      workspace = await this.workspaces.update(workspace, {
        status: "persisted",
        version: workspace.version + 1,
        lastMaterializedAt: new Date().toISOString(),
        lastPersistedAt: new Date().toISOString()
      });

      await this.audit.record(
        "workspace.materialized",
        {
          artifactCount: artifacts.length,
          version: workspace.version
        },
        workspaceId
      );

      return { workspace, artifacts };
    } catch (error) {
      await this.workspaces.update(workspace, { status: "failed" });
      await this.audit.record(
        "workspace.materialization.failed",
        { error: error instanceof Error ? error.message : String(error) },
        workspaceId
      );
      throw error;
    }
  }
}