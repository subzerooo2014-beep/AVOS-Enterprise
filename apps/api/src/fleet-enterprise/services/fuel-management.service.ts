import { Injectable } from "@nestjs/common";
import { FuelPolicy } from "../policies/fuel.policy";
@Injectable()
export class FuelManagementService {
  private readonly entries: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: FuelPolicy) {}
  record(input: { fleetVehicleId: string; liters: number; cost: number; odometer: number }) {
    this.policy.validate(input.liters, input.cost);
    const entry = {
      id: `fuel_${Date.now()}`,
      ...input,
      costPerLiter: Math.round((input.cost / input.liters) * 100) / 100,
      createdAt: new Date().toISOString(),
    };
    this.entries.push(entry);
    return entry;
  }
  list() { return [...this.entries]; }
}
