export type VehicleLifecycleStage =
  | "CREATED"
  | "ANALYZING"
  | "ANALYZED"
  | "DECIDED"
  | "FAILED";

export interface VehicleLifecycleInput {
  vehicleId: string;
  source?: string;
  payload?: Record<string, unknown>;
}

export interface VehicleLifecycleRecord {
  id: string;
  vehicleId: string;
  stage: VehicleLifecycleStage;
  source: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
  intelligence?: Record<string, unknown>;
  decision?: Record<string, unknown>;
  error?: string;
}
