import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { ArtifactMaterializationService } from "./artifact-materialization.service";
import { CheckpointService } from "./checkpoint.service";
import { SynchronizationService } from "./synchronization.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";
import { WorkspaceRecoveryService } from "./workspace-recovery.service";

@Injectable()
export class PersistenceSmokeService {
  constructor(
    private readonly workspaces: WorkspacePersistenceService,
    private readonly materialization: ArtifactMaterializationService,
    private readonly checkpoints: CheckpointService,
    private readonly synchronization: SynchronizationService,
    private readonly recovery: WorkspaceRecoveryService
  ) {}

  async run(): Promise<{
    status: "passed" | "failed";
    score: number;
    checks: Record<string, boolean>;
    workspaceId?: string;
    error?: string;
    completedAt: string;
  }> {
    const checks: Record<string, boolean> = {
      workspaceCreated: false,
      fileMaterialized: false,
      checkpointCreated: false,
      synchronizationPassed: false,
      recoveryPassed: false,
      persistenceAfterRecovery: false
    };

    let workspaceId: string | undefined;

    try {
      const workspace = await this.workspaces.create({
        projectId: `smoke-${randomUUID()}`,
        name: "Code Factory MP4 Smoke Workspace",
        metadata: { disposable: true }
      });
      workspaceId = workspace.id;
      checks.workspaceCreated = true;

      const result = await this.materialization.materialize(workspace.id, {
        files: [
          {
            relativePath: "generated/health.txt",
            content: "AVOS Code Factory Mega Pack 4\n"
          }
        ]
      });
      checks.fileMaterialized = result.artifacts.length === 1;

      const checkpoint = await this.checkpoints.create(
        workspace.id,
        "smoke-safe-point",
        "system:smoke"
      );
      checks.checkpointCreated = Boolean(checkpoint.id);

      const sync = await this.synchronization.synchronize(workspace.id);
      checks.synchronizationPassed = sync.status === "synchronized";

      await fs.writeFile(
        `${workspace.rootPath}/generated/health.txt`,
        "corrupted",
        "utf8"
      );

      const restored = await this.recovery.restore(workspace.id, {
        checkpointId: checkpoint.id,
        approvedByHuman: true,
        approvedBy: "human:smoke-authority"
      });
      checks.recoveryPassed = restored.status === "restored";

      const content = await fs.readFile(
        `${workspace.rootPath}/generated/health.txt`,
        "utf8"
      );
      checks.persistenceAfterRecovery = content.includes(
        "AVOS Code Factory Mega Pack 4"
      );

      const passed = Object.values(checks).filter(Boolean).length;
      const score = Math.round(
        (passed / Object.keys(checks).length) * 100
      );

      return {
        status: score === 100 ? "passed" : "failed",
        score,
        checks,
        workspaceId,
        completedAt: new Date().toISOString()
      };
    } catch (error) {
      const passed = Object.values(checks).filter(Boolean).length;
      return {
        status: "failed",
        score: Math.round(
          (passed / Object.keys(checks).length) * 100
        ),
        checks,
        workspaceId,
        error: error instanceof Error ? error.message : String(error),
        completedAt: new Date().toISOString()
      };
    }
  }
}