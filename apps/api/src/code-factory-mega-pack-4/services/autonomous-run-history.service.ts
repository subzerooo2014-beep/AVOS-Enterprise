import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PersistentFactoryRepository } from "../repositories/persistent-factory.repository";
import { AutonomousRunRecord } from "../types/persistence.types";
import { AuditTraceService } from "./audit-trace.service";
import { CheckpointService } from "./checkpoint.service";
import { WorkspacePersistenceService } from "./workspace-persistence.service";

@Injectable()
export class AutonomousRunHistoryService {
  constructor(
    private readonly repository: PersistentFactoryRepository,
    private readonly workspaces: WorkspacePersistenceService,
    private readonly checkpoints: CheckpointService,
    private readonly audit: AuditTraceService
  ) {}

  async start(
    workspaceId: string,
    objective: string,
    input: Record<string, unknown> = {}
  ): Promise<AutonomousRunRecord> {
    this.workspaces.get(workspaceId);
    const checkpoint = await this.checkpoints.create(
      workspaceId,
      `before-run:${objective.slice(0, 60)}`,
      "system:autonomous-run"
    );

    const run: AutonomousRunRecord = {
      id: `run:${Date.now()}:${randomUUID()}`,
      workspaceId,
      objective,
      status: "running",
      startedAt: new Date().toISOString(),
      input,
      recoveryCheckpointId: checkpoint.id
    };

    await this.repository.saveRun(run);
    await this.audit.record(
      "autonomous-run.started",
      { runId: run.id, objective },
      workspaceId
    );

    return run;
  }

  async complete(
    runId: string,
    output: Record<string, unknown> = {}
  ): Promise<AutonomousRunRecord> {
    const run = this.repository.listRuns().find((item) => item.id === runId);
    if (!run) {
      throw new Error(`Run not found: ${runId}`);
    }

    const updated: AutonomousRunRecord = {
      ...run,
      status: "completed",
      output,
      completedAt: new Date().toISOString()
    };

    await this.repository.saveRun(updated);
    await this.audit.record(
      "autonomous-run.completed",
      { runId },
      run.workspaceId
    );
    return updated;
  }
}