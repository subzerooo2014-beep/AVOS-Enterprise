import { Injectable } from "@nestjs/common";
import { AccidentPolicy } from "../policies/accident.policy";
@Injectable()
export class AccidentService {
  private readonly accidents: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: AccidentPolicy) {}
  record(input: { fleetVehicleId: string; driverId: string; occurredAt: string; description: string; severity: string }) {
    this.policy.validate(input.description, input.severity);
    const accident = {
      id: `accident_${Date.now()}`,
      ...input,
      status: "OPEN",
    };
    this.accidents.push(accident);
    return accident;
  }
  list() { return [...this.accidents]; }
}
