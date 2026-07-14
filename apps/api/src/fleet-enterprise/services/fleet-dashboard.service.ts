import { Injectable } from "@nestjs/common";
import { FleetVehicleService } from "./fleet-vehicle.service";
import { FleetDriverService } from "./fleet-driver.service";
import { TripService } from "./trip.service";
import { WorkOrderService } from "./work-order.service";
@Injectable()
export class FleetDashboardService {
  constructor(
    private readonly vehicles: FleetVehicleService,
    private readonly drivers: FleetDriverService,
    private readonly trips: TripService,
    private readonly workOrders: WorkOrderService,
  ) {}
  summary() {
    const vehicles = this.vehicles.list();
    return {
      vehicles: vehicles.length,
      availableVehicles: vehicles.filter((v) => v.status === "AVAILABLE").length,
      drivers: this.drivers.list().length,
      activeTrips: this.trips.list().filter((t) => t.status === "ACTIVE").length,
      openWorkOrders: this.workOrders.list().filter((w) => w.status !== "COMPLETED").length,
    };
  }
}
