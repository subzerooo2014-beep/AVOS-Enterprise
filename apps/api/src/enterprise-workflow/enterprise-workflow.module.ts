import { Module } from "@nestjs/common";

import { EnterpriseWorkflowController } from "./enterprise-workflow.controller";
import { EnterpriseWorkflowService } from "./enterprise-workflow.service";

import { WorkflowExecutionEngine } from "./engines/workflow-execution.engine";
import { WorkflowStateMachine } from "./engines/workflow-state-machine";
import { WorkflowValidator } from "./engines/workflow-validator";
import { WorkflowRecoveryEngine } from "./engines/workflow-recovery.engine";

@Module({
  controllers: [
    EnterpriseWorkflowController,
  ],
  providers: [
    EnterpriseWorkflowService,
    WorkflowExecutionEngine,
    WorkflowStateMachine,
    WorkflowValidator,
    WorkflowRecoveryEngine,
  ],
  exports: [
    EnterpriseWorkflowService,
    WorkflowExecutionEngine,
    WorkflowStateMachine,
    WorkflowValidator,
    WorkflowRecoveryEngine,
  ],
})
export class EnterpriseWorkflowModule {}
