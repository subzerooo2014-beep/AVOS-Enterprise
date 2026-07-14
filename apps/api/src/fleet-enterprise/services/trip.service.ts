import { Injectable, NotFoundException } from "@nestjs/common";
import { TripPolicy } from "../policies/trip.policy";
import { FleetTripRecord } from "../fleet-enterprise.types";
@Injectable()
export class TripService {
  private readonly trips = new Map<string, FleetTripRecord>();
  constructor(private readonly policy: TripPolicy) {}
  create(input: { fleetId: string; vehicleId: string; driverId: string; origin: string; destination: string }) {
    this.policy.validate(input.origin, input.destination);
    const record: FleetTripRecord = {
      id: `trip_${Date.now()}`,
      ...input,
      status: "PLANNED",
      createdAt: new Date().toISOString(),
    };
    this.trips.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.trips.get(id);
    if (!record) throw new NotFoundException(`Trip ${id} not found`);
    return record;
  }
  start(id: string) {
    const record = this.get(id);
    record.status = "ACTIVE";
    record.startedAt = new Date().toISOString();
    return record;
  }
  complete(id: string, distanceKm: number) {
    const record = this.get(id);
    record.status = "COMPLETED";
    record.distanceKm = distanceKm;
    record.completedAt = new Date().toISOString();
    return record;
  }
  list() { return [...this.trips.values()]; }
}
