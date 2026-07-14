export type FleetVehicleStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "IN_TRIP"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE";

export type WorkOrderStatus =
  | "OPEN"
  | "APPROVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface FleetVehicleRecord {
  id: string;
  vehicleId: string;
  fleetId: string;
  status: FleetVehicleStatus;
  assignedDriverId?: string;
  odometer: number;
  fuelLevel: number;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface FleetDriverRecord {
  id: string;
  userId: string;
  fleetId: string;
  licenseNumber: string;
  trustScore: number;
  safetyScore: number;
  active: boolean;
  createdAt: string;
}

export interface FleetTripRecord {
  id: string;
  fleetId: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  distanceKm?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}
