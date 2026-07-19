import { Injectable } from "@nestjs/common";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { CertificationLifecycleManagerService } from "./certification-lifecycle-manager.service";
import { CertificationWorkflowService } from "./certification-workflow.service";
import { WorkflowAssignmentEngineService } from "./workflow-assignment-engine.service";

@Injectable()
export class WorkflowOrchestratorService {
  constructor(
    private readonly workflows: CertificationWorkflowService,
    private readonly approvals: ApprovalWorkflowService,
    private readonly lifecycle: CertificationLifecycleManagerService,
    private readonly assignments: WorkflowAssignmentEngineService,
  ) {}

  createDemoWorkflow() {
    const workflow = this.workflows.create({
      subjectId: "OMEGA-DEMO-SUBJECT",
      subjectType: "enterprise-capability",
      createdBy: "human:khalifa",
      metadata: {
        sourcePack: "Omega-1 Part 4B",
      },
    });

    const owner = this.assignments.assign({
      workflowId: workflow.workflowId,
      assignee: "human:khalifa",
      role: "owner",
    });

    const inspector = this.assignments.assign({
      workflowId: workflow.workflowId,
      assignee: "agent:omega-inspector",
      role: "inspector",
    });

    let current = this.workflows.transition({
      workflowId: workflow.workflowId,
      to: "inspection-pending",
      actor: "human:khalifa",
      reason: "Inspection requested.",
    });

    this.lifecycle.record(current);

    current = this.workflows.transition({
      workflowId: workflow.workflowId,
      to: "inspection-completed",
      actor: "agent:omega-inspector",
      reason: "Inspection completed with evidence.",
    });

    this.lifecycle.record(current);

    current = this.workflows.transition({
      workflowId: workflow.workflowId,
      to: "approval-pending",
      actor: "agent:omega-reviewer",
      reason: "Ready for final human approval.",
    });

    this.lifecycle.record(current);

    const approval = this.approvals.request({
      workflowId: workflow.workflowId,
      requestedBy: "agent:omega-reviewer",
    });

    return {
      workflow: current,
      approval,
      assignments: [owner, inspector],
      lifecycle: this.lifecycle.history(workflow.workflowId),
    };
  }

  approveAndCertify(input: {
    readonly workflowId: string;
    readonly approvalId: string;
    readonly decidedBy: string;
    readonly reason: string;
  }) {
    const approval = this.approvals.decide({
      approvalId: input.approvalId,
      decision: "approved",
      decidedBy: input.decidedBy,
      reason: input.reason,
    });

    let workflow = this.workflows.transition({
      workflowId: input.workflowId,
      to: "approved",
      actor: input.decidedBy,
      reason: input.reason,
      humanApproved: true,
    });

    this.lifecycle.record(workflow);

    workflow = this.workflows.transition({
      workflowId: input.workflowId,
      to: "certified",
      actor: input.decidedBy,
      reason: "Certification issued after human approval.",
      humanApproved: true,
    });

    const expiresAt = new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const lifecycle = this.lifecycle.record(workflow, {
      expiresAt,
    });

    return {
      approval,
      workflow,
      lifecycle,
      certificate: {
        certificateId: `OMEGA-CERT-${workflow.workflowId}`,
        workflowId: workflow.workflowId,
        subjectId: workflow.subjectId,
        issuedAt: lifecycle.effectiveAt,
        expiresAt,
        status: "active",
        humanApprovedBy: input.decidedBy,
      },
    };
  }
}
