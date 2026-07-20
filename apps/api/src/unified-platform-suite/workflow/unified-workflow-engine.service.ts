import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { WorkflowDefinition } from "../contracts/unified-platform.types";
import { UnifiedEventBusService } from "../events/unified-event-bus.service";

@Injectable()
export class UnifiedWorkflowEngineService {
  private readonly definitions = new Map<string, WorkflowDefinition>();
  private readonly runs: Array<Record<string, unknown>> = [];

  constructor(private readonly events: UnifiedEventBusService) {}

  register(definition: WorkflowDefinition) {
    this.definitions.set(definition.id, definition);
    return definition;
  }

  async run(definition: WorkflowDefinition, input: Record<string, unknown> = {}) {
    this.register(definition);
    const runId = randomUUID();
    const startedAt = new Date().toISOString();
    this.events.publish("platform.workflow.started", "unified-workflow-engine", { runId, workflowId: definition.id });

    const outputs = definition.mode === "parallel"
      ? await Promise.all(definition.steps.map(async (step) => this.executeStep(runId, step, input)))
      : await this.runSequential(runId, definition, input);

    const result = {
      runId,
      workflowId: definition.id,
      status: outputs.some((output) => output.status === "awaiting-human-approval") ? "awaiting-human-approval" : "completed",
      mode: definition.mode,
      outputs,
      startedAt,
      completedAt: new Date().toISOString()
    };
    this.runs.push(result);
    this.events.publish("platform.workflow.completed", "unified-workflow-engine", result);
    return result;
  }

  listRuns() {
    return [...this.runs];
  }

  private async runSequential(runId: string, definition: WorkflowDefinition, input: Record<string, unknown>) {
    const outputs = [];
    for (const step of definition.steps) {
      outputs.push(await this.executeStep(runId, step, input));
    }
    return outputs;
  }

  private async executeStep(runId: string, step: WorkflowDefinition["steps"][number], input: Record<string, unknown>) {
    const status = step.requiresHumanApproval ? "awaiting-human-approval" : "completed";
    const output = {
      runId,
      stepId: step.id,
      suite: step.suite,
      action: step.action,
      status,
      input,
      executedAt: new Date().toISOString()
    };
    this.events.publish("platform.workflow.step", "unified-workflow-engine", output, runId);
    return output;
  }
}