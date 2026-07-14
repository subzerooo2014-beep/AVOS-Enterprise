import { Injectable } from "@nestjs/common";
@Injectable()
export class WorkflowAgent {
  execute(steps: Array<Record<string, unknown>>, input: Record<string, unknown>) {
    return steps.map((step, index) => ({
      index,
      step,
      input,
      status: "COMPLETED",
    }));
  }
}
