import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CertificationStateMachineService } from "./certification-state-machine.service";
import {
  CertificationWorkflow,
  CertificationWorkflowState,
  WorkflowTransition,
} from "./omega-workflow.types";

@Injectable()
export class CertificationWorkflowService {
  private readonly workflows = new Map<string, CertificationWorkflow>();

  constructor(
    private readonly stateMachine: CertificationStateMachineService,
  ) {}

  create(input: {
    readonly subjectId: string;
    readonly subjectType: string;
    readonly createdBy: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
  }): CertificationWorkflow {
    const now = new Date().toISOString();

    const workflow: CertificationWorkflow = {
      workflowId: `OMEGA-WORKFLOW-${randomUUID()}`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      state: "draft",
      createdAt: now,
      updatedAt: now,
      version: 1,
      history: [],
      metadata: {
        createdBy: input.createdBy,
        ...(input.metadata ?? {}),
      },
    };

    this.workflows.set(workflow.workflowId, workflow);
    return workflow;
  }

  transition(input: {
    readonly workflowId: string;
    readonly to: CertificationWorkflowState;
    readonly actor: string;
    readonly reason: string;
    readonly humanApproved?: boolean;
  }): CertificationWorkflow {
    const current = this.require(input.workflowId);

    this.stateMachine.assertTransition(current.state, input.to);

    const sensitiveStates: readonly CertificationWorkflowState[] = [
      "approved",
      "certified",
      "revoked",
    ];

    if (
      sensitiveStates.includes(input.to) &&
      input.humanApproved !== true
    ) {
      throw new Error(
        `Human approval is required for transition to ${input.to}.`,
      );
    }

    const transition: WorkflowTransition = {
      transitionId: `OMEGA-TRANSITION-${randomUUID()}`,
      from: current.state,
      to: input.to,
      actor: input.actor,
      reason: input.reason,
      createdAt: new Date().toISOString(),
      humanApproved: input.humanApproved === true,
    };

    const updated: CertificationWorkflow = {
      ...current,
      state: input.to,
      updatedAt: transition.createdAt,
      version: current.version + 1,
      history: [...current.history, transition],
    };

    this.workflows.set(updated.workflowId, updated);
    return updated;
  }

  get(workflowId: string): CertificationWorkflow | null {
    return this.workflows.get(workflowId) ?? null;
  }

  all(): readonly CertificationWorkflow[] {
    return [...this.workflows.values()];
  }

  private require(workflowId: string): CertificationWorkflow {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Certification workflow not found: ${workflowId}`);
    }

    return workflow;
  }
}
