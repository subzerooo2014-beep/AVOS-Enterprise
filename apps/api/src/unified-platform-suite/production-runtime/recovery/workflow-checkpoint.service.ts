import { Injectable } from "@nestjs/common";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class WorkflowCheckpointService {
  constructor(private readonly persistence: ProductionPersistenceService) {}

  async save(workflowRunId: string, stepId: string, state: Record<string, unknown>) {
    const id = `${workflowRunId}:${stepId}`;
    return this.persistence.upsert("checkpoint", id, {
      workflowRunId,
      stepId,
      state,
      checkpointedAt: new Date().toISOString()
    });
  }

  async get(workflowRunId: string, stepId: string) {
    return this.persistence.get<Record<string, unknown>>("checkpoint", `${workflowRunId}:${stepId}`);
  }

  async listForRun(workflowRunId: string) {
    const records = await this.persistence.list<Record<string, unknown>>("checkpoint");
    return records.filter((record) => record.id.startsWith(`${workflowRunId}:`));
  }
}