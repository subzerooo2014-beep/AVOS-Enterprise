import { Injectable, NotFoundException } from "@nestjs/common";
import type { AiTaskRecord } from "./enterprise-autonomous-ai.types";

@Injectable()
export class AiTaskPlannerService {
  private readonly tasks = new Map<string, AiTaskRecord>();

  plan(
    objective: string,
    steps: string[],
    context: Record<string, unknown> = {},
    agentId?: string,
  ): AiTaskRecord {
    const now = new Date().toISOString();
    const task: AiTaskRecord = {
      id: `ai-task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      objective,
      agentId,
      status: "PLANNED",
      steps: [...steps],
      context: { ...context },
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return this.get(task.id);
  }

  update(id: string, patch: Partial<AiTaskRecord>): AiTaskRecord {
    const task = this.get(id);
    const updated: AiTaskRecord = {
      ...task,
      ...patch,
      steps: patch.steps ? [...patch.steps] : [...task.steps],
      context: patch.context ? { ...patch.context } : { ...task.context },
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, updated);
    return this.get(id);
  }

  get(id: string): AiTaskRecord {
    const task = this.tasks.get(id);
    if (!task) throw new NotFoundException(`AI task '${id}' was not found.`);
    return {
      ...task,
      steps: [...task.steps],
      context: { ...task.context },
    };
  }

  list(): AiTaskRecord[] {
    return Array.from(this.tasks.values()).map((task) => this.get(task.id));
  }

  count(): number {
    return this.tasks.size;
  }
}
