import { Injectable } from "@nestjs/common";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { CertificationLifecycleManagerService } from "./certification-lifecycle-manager.service";
import { CertificationStateMachineService } from "./certification-state-machine.service";
import { CertificationWorkflowService } from "./certification-workflow.service";
import { WorkflowAssignmentEngineService } from "./workflow-assignment-engine.service";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";

@Injectable()
export class OmegaWorkflowFacadeService {
  constructor(
    private readonly stateMachine: CertificationStateMachineService,
    private readonly workflows: CertificationWorkflowService,
    private readonly approvals: ApprovalWorkflowService,
    private readonly lifecycle: CertificationLifecycleManagerService,
    private readonly assignments: WorkflowAssignmentEngineService,
    private readonly orchestrator: WorkflowOrchestratorService,
  ) {}

  status() {
    return {
      system: "AVOS Omega Certification Workflow",
      pack: "Mega Pack Omega-1 Part 4B",
      version: "2.0.0-omega.4b",
      status: "healthy",
      capabilities: 7,
      humanFinalAuthority: true,
      autonomousFinalApproval: false,
      next: "Omega-1 Part 4C",
    };
  }

  createDemo() {
    return this.orchestrator.createDemoWorkflow();
  }

  approveAndCertify(input: {
    readonly workflowId: string;
    readonly approvalId: string;
    readonly decidedBy?: string;
    readonly reason?: string;
  }) {
    return this.orchestrator.approveAndCertify({
      workflowId: input.workflowId,
      approvalId: input.approvalId,
      decidedBy: input.decidedBy ?? "human:khalifa",
      reason: input.reason ?? "Approved by human final authority.",
    });
  }

  registry() {
    return {
      workflows: this.workflows.all(),
      approvals: this.approvals.all(),
      assignments: this.assignments.all(),
    };
  }

  allowedTransitions(state: Parameters<CertificationStateMachineService["allowedTransitions"]>[0]) {
    return {
      state,
      allowed: this.stateMachine.allowedTransitions(state),
    };
  }

  lifecycleHistory(workflowId: string) {
    return this.lifecycle.history(workflowId);
  }
}
