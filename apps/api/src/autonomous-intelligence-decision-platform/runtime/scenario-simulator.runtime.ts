import { Injectable } from "@nestjs/common";

@Injectable()
export class ScenarioSimulatorRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "scenario-simulator_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
