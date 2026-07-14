import { Injectable } from "@nestjs/common";
@Injectable()
export class SimulationEngine {
  simulate(input: {
    variables: Record<string, number>;
    assumptions: Record<string, unknown>;
  }) {
    const total = Object.values(input.variables)
      .reduce((sum, value) => sum + value, 0);
    return {
      total,
      variables: input.variables,
      assumptions: input.assumptions,
      outcome: total >= 0 ? "POSITIVE" : "NEGATIVE",
    };
  }
}
