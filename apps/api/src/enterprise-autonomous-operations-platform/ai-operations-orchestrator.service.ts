import { Injectable, NotFoundException } from "@nestjs/common";
import type { OperationsActionRecord } from "./enterprise-autonomous-operations.types";

@Injectable()
export class AiOperationsOrchestratorService {
  private readonly actions = new Map<string, OperationsActionRecord>();

  plan(
    name: string,
    actionType: string,
    target: string,
    parameters: Record<string, unknown> = {},
  ): OperationsActionRecord {
    const now = new Date().toISOString();

    const action: OperationsActionRecord = {
      id: `ops-action-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      actionType,
      target,
      status: "PLANNED",
      parameters: { ...parameters },
      createdAt: now,
      updatedAt: now,
    };

    this.actions.set(action.id, action);
    return this.clone(action);
  }

  execute(id: string): OperationsActionRecord {
    const action = this.requireAction(id);
    action.status = "COMPLETED";
    action.completedAt = new Date().toISOString();
    action.updatedAt = action.completedAt;
    return this.clone(action);
  }

  fail(id: string, error: string): OperationsActionRecord {
    const action = this.requireAction(id);
    action.status = "FAILED";
    action.error = error;
    action.updatedAt = new Date().toISOString();
    return this.clone(action);
  }

  list(): OperationsActionRecord[] {
    return Array.from(this.actions.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.actions.size;
  }

  runningCount(): number {
    return this.list().filter((item) => item.status === "RUNNING").length;
  }

  failedCount(): number {
    return this.list().filter((item) => item.status === "FAILED").length;
  }

  private requireAction(id: string): OperationsActionRecord {
    const action = this.actions.get(id);
    if (!action) throw new NotFoundException(`Operations action '${id}' was not found.`);
    return action;
  }

  private clone(item: OperationsActionRecord): OperationsActionRecord {
    return { ...item, parameters: { ...item.parameters } };
  }
}
