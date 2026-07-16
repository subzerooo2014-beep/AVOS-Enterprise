import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationWorkflowV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationWorkflowEngineV1Service {
  private readonly workflows = new Map<string, FoundationWorkflowV1>();

  create(
    name: string,
    steps: string[],
    context: Record<string, unknown> = {},
  ): FoundationWorkflowV1 {
    const now = new Date().toISOString();

    const workflow: FoundationWorkflowV1 = {
      id: `foundation-workflow-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      status: "DRAFT",
      steps: [...steps],
      currentStepIndex: 0,
      context: { ...context },
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(workflow.id, workflow);
    return this.clone(workflow);
  }

  start(id: string): FoundationWorkflowV1 {
    const workflow = this.requireWorkflow(id);
    workflow.status = "RUNNING";
    workflow.updatedAt = new Date().toISOString();
    return this.clone(workflow);
  }

  advance(id: string): FoundationWorkflowV1 {
    const workflow = this.requireWorkflow(id);

    if (workflow.currentStepIndex >= workflow.steps.length - 1) {
      workflow.status = "COMPLETED";
    } else {
      workflow.currentStepIndex += 1;
      workflow.status = "RUNNING";
    }

    workflow.updatedAt = new Date().toISOString();
    return this.clone(workflow);
  }

  fail(id: string, error: string): FoundationWorkflowV1 {
    const workflow = this.requireWorkflow(id);
    workflow.status = "FAILED";
    workflow.error = error;
    workflow.updatedAt = new Date().toISOString();
    return this.clone(workflow);
  }

  list(): FoundationWorkflowV1[] {
    return Array.from(this.workflows.values()).map((workflow) => this.clone(workflow));
  }

  count(): number {
    return this.workflows.size;
  }

  runningCount(): number {
    return this.list().filter((workflow) => workflow.status === "RUNNING").length;
  }

  private requireWorkflow(id: string): FoundationWorkflowV1 {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new NotFoundException(`Foundation workflow '${id}' was not found.`);
    }
    return workflow;
  }

  private clone(workflow: FoundationWorkflowV1): FoundationWorkflowV1 {
    return {
      ...workflow,
      steps: [...workflow.steps],
      context: { ...workflow.context },
    };
  }
}
