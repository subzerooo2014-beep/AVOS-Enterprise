import { Injectable } from "@nestjs/common";

@Injectable()
export class CircuitCoordinationService {
  private readonly circuits = new Map<string, "closed" | "open" | "half-open">();

  transition(unit: string, state: "closed" | "open" | "half-open") {
    this.circuits.set(unit, state);
    return { unit, state, changedAt: new Date().toISOString() };
  }

  status() {
    return Array.from(this.circuits.entries()).map(([unit, state]) => ({
      unit,
      state,
    }));
  }
}