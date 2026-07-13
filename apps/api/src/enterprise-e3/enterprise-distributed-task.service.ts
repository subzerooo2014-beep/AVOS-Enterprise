import { Injectable } from "@nestjs/common";
import { EnterpriseTaskRecord } from "./enterprise-e3.types";

@Injectable()
export class EnterpriseDistributedTaskService {
  private readonly tasks = new Map<string, EnterpriseTaskRecord>();

  queue(input: {
    type: string;
    payload?: Record<string, unknown>;
    maxAttempts?: number;
  }) {
    const now = new Date().toISOString();
    const task: EnterpriseTaskRecord = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: input.type,
      status: "QUEUED",
      attempts: 0,
      maxAttempts: Math.max(1, input.maxAttempts ?? 3),
      payload: input.payload ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  execute(id: string) {
    const current = this.tasks.get(id);
    if (!current) throw new Error(`Task not found: ${id}`);

    const running: EnterpriseTaskRecord = {
      ...current,
      status: "RUNNING",
      attempts: current.attempts + 1,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, running);

    const completed: EnterpriseTaskRecord = {
      ...running,
      status: "COMPLETED",
      result: {
        processed: true,
        taskType: running.type,
      },
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, completed);
    return completed;
  }

  fail(id: string, error: string) {
    const current = this.tasks.get(id);
    if (!current) throw new Error(`Task not found: ${id}`);

    const failed: EnterpriseTaskRecord = {
      ...current,
      status: "FAILED",
      error,
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, failed);
    return failed;
  }

  list() {
    return [...this.tasks.values()];
  }
}
