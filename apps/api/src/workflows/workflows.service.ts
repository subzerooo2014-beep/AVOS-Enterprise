import { Injectable, NotFoundException } from "@nestjs/common";
import type { CoreWorkflowExecution } from "../core-application-flows/core-flow.types";
import { requireText } from "../core-application-flows/core-flow.utils";

@Injectable()
export class WorkflowsService {
  private readonly executions = new Map<string, CoreWorkflowExecution>();

  findAll() {
    return Array.from(this.executions.values()).reverse();
  }

  findOne(id: string) {
    const execution = this.executions.get(id);
    if (!execution) throw new NotFoundException("Workflow execution not found");
    return execution;
  }

  create(dto: any) {
    const steps = Array.isArray(dto?.steps) ? dto.steps : [];
    const execution: CoreWorkflowExecution = {
      id: `wf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: requireText(dto?.name, "name"),
      status: "running",
      steps: steps.map((step: any) => ({
        name: requireText(step?.name ?? step, "step name"),
        status: "pending",
      })),
      startedAt: new Date().toISOString(),
    };
    this.executions.set(execution.id, execution);
    return execution;
  }

  completeStep(id: string, stepName: string, output?: unknown) {
    const execution = this.findOne(id);
    const step = execution.steps.find((item) => item.name === stepName);
    if (!step) throw new NotFoundException("Workflow step not found");

    step.status = "completed";
    step.output = output;

    if (execution.steps.every((item) => item.status === "completed")) {
      execution.status = "completed";
      execution.completedAt = new Date().toISOString();
    }

    return execution;
  }

  fail(id: string, reason: unknown) {
    const execution = this.findOne(id);
    execution.status = "failed";
    execution.completedAt = new Date().toISOString();
    execution.steps.push({
      name: "failure",
      status: "failed",
      output: reason,
    });
    return execution;
  }

  remove(id: string) {
    const execution = this.findOne(id);
    this.executions.delete(id);
    return { deleted: true, execution };
  }
}
