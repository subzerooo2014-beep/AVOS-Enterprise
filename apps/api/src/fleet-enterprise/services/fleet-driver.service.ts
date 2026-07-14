import { Injectable, NotFoundException } from "@nestjs/common";
import { FleetDriverRecord } from "../fleet-enterprise.types";
@Injectable()
export class FleetDriverService {
  private readonly drivers = new Map<string, FleetDriverRecord>();
  register(input: { fleetId: string; userId: string; licenseNumber: string; trustScore: number }) {
    const record: FleetDriverRecord = {
      id: `driver_${Date.now()}`,
      ...input,
      safetyScore: 100,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.drivers.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.drivers.get(id);
    if (!record) throw new NotFoundException(`Driver ${id} not found`);
    return record;
  }
  list() { return [...this.drivers.values()]; }
}
