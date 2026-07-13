import { Injectable } from "@nestjs/common";

import { WorkflowExecutionEngine } from "./engines/workflow-execution.engine";
import { WorkflowStateMachine } from "./engines/workflow-state-machine";
import { WorkflowValidator } from "./engines/workflow-validator";
import { WorkflowRecoveryEngine } from "./engines/workflow-recovery.engine";

@Injectable()
export class EnterpriseWorkflowService {
  constructor(
    private readonly execution: WorkflowExecutionEngine,
    private readonly stateMachine: WorkflowStateMachine,
    private readonly validator: WorkflowValidator,
    private readonly recovery: WorkflowRecoveryEngine,
  ) {}

  createWorkflow(input: any) {
    this.validator.validate(input);

    return {
      success: true,
      workflowId: `workflow-${Date.now()}`,
      state: this.stateMachine.initialState(),
      createdAt: new Date().toISOString(),
      payload: input,
    };
  }

  executeWorkflow(workflow: any) {
    const result = this.execution.execute(workflow);

    return {
      success: true,
      workflowId: workflow.workflowId,
      state: this.stateMachine.completeState(),
      result,
      completedAt: new Date().toISOString(),
    };
  }

  recoverWorkflow(workflow: any) {
    return this.recovery.recover(workflow);
  }

  status() {
    return {
      system: "AVOS Enterprise Workflow",
      version: "E1.1",
      status: "running",
    };
  }
}
