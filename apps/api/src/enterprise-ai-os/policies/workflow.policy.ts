import { Injectable } from "@nestjs/common";
@Injectable()
export class WorkflowPolicy {
  validate(name: string, trigger: string, steps: Array<Record<string, unknown>>) {
    if (!name || !trigger) throw new Error("Workflow name and trigger required");
    if (!steps.length) throw new Error("Workflow requires at least one step");
    return true;
  }
}
