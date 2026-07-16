import { Injectable } from "@nestjs/common";
import { AiTaskPlannerService } from "./ai-task-planner.service";

@Injectable()
export class AiWorkflowBridgeService {
  constructor(private readonly planner: AiTaskPlannerService) {}

  createWorkflowTask(
    workflowExecutionId: string,
    objective: string,
    steps: string[],
    agentId?: string,
  ) {
    return this.planner.plan(
      objective,
      steps,
      { workflowExecutionId },
      agentId,
    );
  }
}
