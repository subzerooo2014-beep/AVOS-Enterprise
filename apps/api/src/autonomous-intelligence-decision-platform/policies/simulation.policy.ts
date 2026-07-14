import { Injectable } from "@nestjs/common";

@Injectable()
export class SimulationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid simulation input");
    }
    return true;
  }
}
