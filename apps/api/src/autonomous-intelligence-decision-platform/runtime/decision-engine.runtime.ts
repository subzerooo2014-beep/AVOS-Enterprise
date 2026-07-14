import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionEngineRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "decision-engine_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
