import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowExecutionEngine {
  execute(workflow: any) {
    const startedAt = new Date().toISOString();

    return {
      success: true,
      executionId: `exec-${Date.now()}`,
      workflowId: workflow.workflowId ?? null,
      status: "COMPLETED",
      startedAt,
      finishedAt: new Date().toISOString(),
      stepsExecuted: Array.isArray(workflow.steps)
        ? workflow.steps.length
        : 0,
      output: workflow.payload ?? workflow,
    };
  }
}
