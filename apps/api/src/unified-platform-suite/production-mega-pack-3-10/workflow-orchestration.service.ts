import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

type WorkflowStatus =
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "compensated"
  | "failed";

export interface WorkflowInstance {
  id: string;
  name: string;
  status: WorkflowStatus;
  currentStep: number;
  steps: string[];
  requiresHumanApproval: boolean;
  approvedBy: string | null;
  startedAt: string;
  updatedAt: string;
}

@Injectable()
export class WorkflowOrchestrationService {
  private readonly workflows = new Map<string, WorkflowInstance>();

  start(input: {
    name: string;
    steps: string[];
    requiresHumanApproval?: boolean;
  }): WorkflowInstance {
    const requiresApproval = input.requiresHumanApproval ?? false;

    const workflow: WorkflowInstance = {
      id: randomUUID(),
      name: input.name,
      status: requiresApproval
        ? "waiting-human-approval"
        : "running",
      currentStep: 0,
      steps: input.steps,
      requiresHumanApproval: requiresApproval,
      approvedBy: null,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.workflows.set(workflow.id, workflow);
    return { ...workflow };
  }

  approve(id: string, approvedBy: string): WorkflowInstance {
    const workflow = this.requireWorkflow(id);
    workflow.approvedBy = approvedBy;
    workflow.status = "running";
    workflow.updatedAt = new Date().toISOString();

    return { ...workflow };
  }

  advance(id: string): WorkflowInstance {
    const workflow = this.requireWorkflow(id);

    if (workflow.status === "waiting-human-approval") {
      return { ...workflow };
    }

    workflow.currentStep += 1;
    workflow.updatedAt = new Date().toISOString();

    if (workflow.currentStep >= workflow.steps.length) {
      workflow.status = "completed";
    }

    return { ...workflow };
  }

  compensate(id: string): WorkflowInstance {
    const workflow = this.requireWorkflow(id);
    workflow.status = "compensated";
    workflow.updatedAt = new Date().toISOString();

    return { ...workflow };
  }

  status(): Record<string, unknown> {
    const workflows = [...this.workflows.values()];

    return {
      name: "Workflow and Process Orchestration",
      status: "operational",
      workflowEngine: true,
      sagaPattern: true,
      longRunningTransactions: true,
      humanApprovalWorkflow: true,
      processMonitoring: {
        total: workflows.length,
        running: workflows.filter(
          (item) => item.status === "running"
        ).length,
        waitingHumanApproval: workflows.filter(
          (item) => item.status === "waiting-human-approval"
        ).length,
        completed: workflows.filter(
          (item) => item.status === "completed"
        ).length
      }
    };
  }

  private requireWorkflow(id: string): WorkflowInstance {
    const workflow = this.workflows.get(id);

    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }

    return workflow;
  }
}