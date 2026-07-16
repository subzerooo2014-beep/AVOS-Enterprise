import { Injectable } from "@nestjs/common";
import type { ScheduledTaskRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class SchedulerControlService {
  private readonly tasks = new Map<string, ScheduledTaskRecord>();

  register(
    task: ScheduledTaskRecord,
  ): ScheduledTaskRecord {
    this.tasks.set(task.id, {
      ...task,
      payload: { ...task.payload },
    });

    return { ...task, payload: { ...task.payload } };
  }

  list(): ScheduledTaskRecord[] {
    return Array.from(this.tasks.values()).map((task) => ({
      ...task,
      payload: { ...task.payload },
    }));
  }

  markRun(id: string, nextRunAt?: string): ScheduledTaskRecord | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    task.lastRunAt = new Date().toISOString();
    task.nextRunAt = nextRunAt;
    return { ...task, payload: { ...task.payload } };
  }

  count(): number {
    return this.tasks.size;
  }
}
