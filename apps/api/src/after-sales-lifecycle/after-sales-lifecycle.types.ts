export type LifecycleStatus =
  | "ACTIVE"
  | "SERVICE_DUE"
  | "IN_SERVICE"
  | "RECALL"
  | "WARRANTY_REVIEW"
  | "OUT_OF_SERVICE"
  | "RETIRED";

export interface VehicleLifecycleRecord {
  id: string;
  vehicleId: string;
  ownerId: string;
  status: LifecycleStatus;
  odometer: number;
  healthScore: number;
  warrantyActive: boolean;
  serviceCount: number;
  recallCount: number;
  createdAt: string;
  updatedAt: string;
}
