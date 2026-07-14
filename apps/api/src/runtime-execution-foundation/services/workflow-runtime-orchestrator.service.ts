import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowRuntimeOrchestratorService {
  private readonly records: Array<Record<string, unknown>> = [];

  create(input: Record<string, unknown>) {
    const record = {
      id: "workflow-runtime-orchestrator_"+Date.now(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }
}
