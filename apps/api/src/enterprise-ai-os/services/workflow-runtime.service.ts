import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkflowPolicy } from "../policies/workflow.policy";
import { aiOsId } from "../enterprise-ai-os.utils";
@Injectable()
export class WorkflowRuntimeService {
  private readonly workflows = new Map<string, Record<string, unknown>>();
  private readonly executions: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: WorkflowPolicy) {}
  create(input: {
    name: string;
    trigger: string;
    steps: Array<Record<string, unknown>>;
  }) {
    this.policy.validate(input.name, input.trigger, input.steps);
    const record = {
      id: aiOsId("workflow"),
      ...input,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.workflows.set(String(record.id), record);
    return record;
  }
  execute(id: string, input: Record<string, unknown>) {
    const workflow = this.workflows.get(id);
    if (!workflow) throw new NotFoundException(`Workflow ${id} not found`);
    const execution = {
      id: aiOsId("execution"),
      workflowId: id,
      input,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    };
    this.executions.push(execution);
    return execution;
  }
  list() { return [...this.workflows.values()]; }
}
