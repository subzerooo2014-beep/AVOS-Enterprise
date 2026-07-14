import { Injectable } from "@nestjs/common";
import { DriverAssignmentPolicy } from "../policies/driver-assignment.policy";
import { FleetVehicleService } from "./fleet-vehicle.service";
import { FleetDriverService } from "./fleet-driver.service";
@Injectable()
export class DriverAssignmentService {
  constructor(
    private readonly policy: DriverAssignmentPolicy,
    private readonly vehicles: FleetVehicleService,
    private readonly drivers: FleetDriverService,
  ) {}
  assign(fleetVehicleId: string, driverId: string) {
    const vehicle = this.vehicles.get(fleetVehicleId);
    const driver = this.drivers.get(driverId);
    this.policy.validate({
      trustScore: driver.trustScore,
      active: driver.active,
      vehicleAvailable: vehicle.status === "AVAILABLE",
    });
    vehicle.assignedDriverId = driver.id;
    vehicle.status = "ASSIGNED";
    vehicle.updatedAt = new Date().toISOString();
    return vehicle;
  }
}
