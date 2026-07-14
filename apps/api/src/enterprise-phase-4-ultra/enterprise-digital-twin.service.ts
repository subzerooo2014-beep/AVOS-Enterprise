import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DigitalTwinState } from "./enterprise-phase-4-ultra.types";

@Injectable()
export class EnterpriseDigitalTwinService {
  private readonly states: DigitalTwinState[] = [];

  synchronize(domain = "avos-enterprise"): DigitalTwinState {
    const state: DigitalTwinState = {
      id: randomUUID(),
      domain,
      version: this.states.length + 1,
      healthScore: 96,
      synchronizedAt: new Date().toISOString(),
    };

    this.states.push(state);
    return state;
  }

  latest(): DigitalTwinState | null {
    return this.states.length > 0 ? this.states[this.states.length - 1] : null;
  }

  count(): number {
    return this.states.length;
  }
}