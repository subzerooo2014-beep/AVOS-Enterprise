import { Injectable } from "@nestjs/common";
@Injectable()
export class OrchestrationEngine {
  orchestrate(tasks: Array<{ id: string; priority: number }>) {
    return tasks
      .slice()
      .sort((a, b) => b.priority - a.priority)
      .map((task, index) => ({
        ...task,
        executionOrder: index + 1,
      }));
  }
}
