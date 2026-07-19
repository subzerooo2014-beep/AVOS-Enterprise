import { Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { WorkspaceHealth } from "../types/persistence.types";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class WorkspaceHealthService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService
  ) {}

  async check(workspaceId: string): Promise<WorkspaceHealth> {
    const workspace = this.workspaces.get(workspaceId);
    const artifacts = this.repository.listArtifacts(workspaceId);
    const checkpoints = this.repository.listCheckpoints(workspaceId);
    const reasons: string[] = [];

    const rootExists = await fs
      .stat(workspace.rootPath)
      .then((stats) => stats.isDirectory())
      .catch(() => false);
    const hasMetadata = await fs
      .stat(`${workspace.rootPath}/.avos-workspace.json`)
      .then((stats) => stats.isFile())
      .catch(() => false);
    const hasCheckpoint = checkpoints.some((item) => item.safe);
    const stateHealthy = !["failed", "conflicted", "degraded"].includes(
      workspace.status
    );

    const checks = {
      rootExists,
      metadataExists: hasMetadata,
      repositoryRecordExists: true,
      stateHealthy,
      checkpointReady: hasCheckpoint,
      artifactRepositoryConsistent: artifacts.every(
        (item) => item.workspaceId === workspaceId
      )
    };

    for (const [name, passed] of Object.entries(checks)) {
      if (!passed) reasons.push(`${name} failed`);
    }

    const total = Object.keys(checks).length;
    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passed / total) * 100);
    const status =
      score >= 90 ? "healthy" : score >= 65 ? "degraded" : "critical";

    return {
      workspaceId,
      status,
      score,
      checks,
      reasons,
      checkedAt: new Date().toISOString()
    };
  }
}