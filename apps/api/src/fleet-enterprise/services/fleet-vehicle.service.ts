import { Injectable, NotFoundException } from "@nestjs/common";
import { FleetVehiclePolicy } from "../policies/fleet-vehicle.policy";
import { FleetVehicleRecord } from "../fleet-enterprise.types";
@Injectable()
export class FleetVehicleService {
  private readonly vehicles = new Map<string, FleetVehicleRecord>();
  constructor(private readonly policy: FleetVehiclePolicy) {}
  register(input: { fleetId: string; vehicleId: string; odometer: number; fuelLevel: number }) {
    this.policy.validate(input.odometer, input.fuelLevel);
    const now = new Date().toISOString();
    const record: FleetVehicleRecord = {
      id: `fleet_vehicle_${Date.now()}`,
      ...input,
      status: "AVAILABLE",
      healthScore: 100,
      createdAt: now,
      updatedAt: now,
    };
    this.vehicles.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.vehicles.get(id);
    if (!record) throw new NotFoundException(`Fleet vehicle ${id} not found`);
    return record;
  }
  list() { return [...this.vehicles.values()]; }
}
