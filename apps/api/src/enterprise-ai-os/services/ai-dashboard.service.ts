import { Injectable } from "@nestjs/common";
import { AgentRegistryService } from "./agent-registry.service";
import { TaskRuntimeService } from "./task-runtime.service";
import { LearningStoreService } from "./learning-store.service";
import { WorkflowRuntimeService } from "./workflow-runtime.service";
@Injectable()
export class AiDashboardService {
  constructor(
    private readonly agents: AgentRegistryService,
    private readonly tasks: TaskRuntimeService,
    private readonly learning: LearningStoreService,
    private readonly workflows: WorkflowRuntimeService,
  ) {}
  summary() {
    const tasks = this.tasks.list();
    return {
      agents: this.agents.list().length,
      tasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === "COMPLETED").length,
      failedTasks: tasks.filter((task) => task.status === "FAILED").length,
      learningRecords: this.learning.list().length,
      workflows: this.workflows.list().length,
    };
  }
}
