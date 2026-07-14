import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionGraphRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "decision-graph_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
