import { Injectable } from "@nestjs/common";
import { fleetId } from "./fleet-enterprise.utils";
import { FleetRepositoryService } from "./services/fleet-repository.service";
import { FleetVehicleService } from "./services/fleet-vehicle.service";
import { FleetDriverService } from "./services/fleet-driver.service";
import { DriverAssignmentService } from "./services/driver-assignment.service";
import { TripService } from "./services/trip.service";
import { WorkOrderService } from "./services/work-order.service";
import { FuelManagementService } from "./services/fuel-management.service";
import { GpsService } from "./services/gps.service";
import { TelematicsService } from "./services/telematics.service";
import { AccidentService } from "./services/accident.service";
import { ClaimService } from "./services/claim.service";
import { RouteService } from "./services/route.service";
import { FleetAuditService } from "./services/fleet-audit.service";

@Injectable()
export class FleetEnterpriseService {
  constructor(
    private readonly fleets: FleetRepositoryService,
    private readonly vehicles: FleetVehicleService,
    private readonly drivers: FleetDriverService,
    private readonly assignments: DriverAssignmentService,
    private readonly trips: TripService,
    private readonly workOrders: WorkOrderService,
    private readonly fuel: FuelManagementService,
    private readonly gps: GpsService,
    private readonly telematics: TelematicsService,
    private readonly accidents: AccidentService,
    private readonly claims: ClaimService,
    private readonly routes: RouteService,
    private readonly audit: FleetAuditService,
  ) {}

  createFleet(input: { organizationId: string; name: string; region: string }) {
    const record = {
      id: fleetId("fleet"),
      ...input,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.fleets.save(record);
    this.audit.record("FLEET_CREATED", record.id);
    return record;
  }

  registerVehicle(input: {
    fleetId: string;
    vehicleId: string;
    odometer: number;
    fuelLevel: number;
  }) {
    return this.vehicles.register(input);
  }

  registerDriver(input: {
    fleetId: string;
    userId: string;
    licenseNumber: string;
    trustScore: number;
  }) {
    return this.drivers.register(input);
  }

  assignDriver(fleetVehicleId: string, driverId: string) {
    return this.assignments.assign(fleetVehicleId, driverId);
  }

  createTrip(input: {
    fleetId: string;
    vehicleId: string;
    driverId: string;
    origin: string;
    destination: string;
  }) {
    return this.trips.create(input);
  }

  startTrip(id: string) {
    return this.trips.start(id);
  }

  completeTrip(id: string, distanceKm: number) {
    return this.trips.complete(id, distanceKm);
  }

  createWorkOrder(input: {
    fleetVehicleId: string;
    title: string;
    description: string;
    priority: string;
    estimatedCost?: number;
  }) {
    return this.workOrders.create(input);
  }

  recordFuel(input: {
    fleetVehicleId: string;
    liters: number;
    cost: number;
    odometer: number;
  }) {
    return this.fuel.record(input);
  }

  recordGps(input: {
    fleetVehicleId: string;
    latitude: number;
    longitude: number;
    speed: number;
    recordedAt?: string;
  }) {
    return this.gps.record(input);
  }

  recordTelematics(input: Record<string, unknown>) {
    return this.telematics.record(input);
  }

  recordAccident(input: {
    fleetVehicleId: string;
    driverId: string;
    occurredAt: string;
    description: string;
    severity: string;
  }) {
    return this.accidents.record(input);
  }

  createClaim(input: {
    accidentId: string;
    insurer: string;
    estimatedAmount: number;
  }) {
    return this.claims.create(input);
  }

  createRoute(input: {
    fleetId: string;
    name: string;
    stops: string[];
    estimatedDistanceKm: number;
  }) {
    return this.routes.create(input);
  }

  getFleet(id: string) { return this.fleets.get(id); }
  listFleets() { return this.fleets.list(); }
}
