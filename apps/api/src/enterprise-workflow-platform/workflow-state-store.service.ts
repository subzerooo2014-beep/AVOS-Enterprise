import { Injectable, NotFoundException } from "@nestjs/common";
import type { WorkflowExecution } from "./enterprise-workflow.types";

@Injectable()
export class WorkflowStateStoreService {
  private readonly executions = new Map<string, WorkflowExecution>();

  save(execution: WorkflowExecution): WorkflowExecution {
    const normalized: WorkflowExecution = {
      ...execution,
      context: { ...execution.context },
      steps: execution.steps.map((step) => ({ ...step })),
      updatedAt: new Date().toISOString(),
    };

    this.executions.set(normalized.id, normalized);
    return this.clone(normalized);
  }

  get(id: string): WorkflowExecution {
    const execution = this.executions.get(id);
    if (!execution) {
      throw new NotFoundException(`Workflow execution '${id}' was not found.`);
    }
    return this.clone(execution);
  }

  list(): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .map((item) => this.clone(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  delete(id: string): boolean {
    return this.executions.delete(id);
  }

  count(): number {
    return this.executions.size;
  }

  private clone(item: WorkflowExecution): WorkflowExecution {
    return {
      ...item,
      context: { ...item.context },
      steps: item.steps.map((step) => ({ ...step })),
    };
  }
}
