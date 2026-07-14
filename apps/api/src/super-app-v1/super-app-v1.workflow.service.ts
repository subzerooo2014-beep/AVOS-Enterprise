import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AgentResult,
  SuperAppWorkflow,
  WorkflowStep,
} from "./super-app-v1.types";

@Injectable()
export class SuperAppWorkflowService {
  private readonly workflows = new Map<string, SuperAppWorkflow>();

  create(userId: string, intent: string): SuperAppWorkflow {
    const steps: WorkflowStep[] = [
      { id: randomUUID(), name: "analyze-intent", status: "CREATED" },
      { id: randomUUID(), name: "run-agent-mesh", status: "CREATED" },
      { id: randomUUID(), name: "compose-plan", status: "CREATED" },
      { id: randomUUID(), name: "prepare-actions", status: "CREATED" },
    ];

    const workflow: SuperAppWorkflow = {
      id: randomUUID(),
      userId,
      intent,
      status: "CREATED",
      steps,
      agentResults: [],
      createdAt: new Date().toISOString(),
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  complete(
    workflowId: string,
    agentResults: AgentResult[],
  ): SuperAppWorkflow {
    const workflow = this.get(workflowId);

    workflow.status = "RUNNING";
    workflow.agentResults = agentResults;

    for (const step of workflow.steps) {
      step.status = "COMPLETED";
      step.result = {
        completedAt: new Date().toISOString(),
      };
    }

    workflow.status = "COMPLETED";
    workflow.completedAt = new Date().toISOString();
    return workflow;
  }

  get(id: string): SuperAppWorkflow {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }
    return workflow;
  }

  list(): SuperAppWorkflow[] {
    return [...this.workflows.values()];
  }
}