export type VehicleBrainIntegrationStatus =
  | "queued"
  | "dispatched"
  | "completed"
  | "failed";

export interface VehicleBrainIntegrationCommand {
  vehicleId: string;
  command:
    | "ANALYZE_VEHICLE"
    | "REFRESH_PRICING"
    | "RUN_FRAUD_CHECK"
    | "PUBLISH_DECISION";
  payload?: Record<string, unknown>;
}

export interface VehicleBrainIntegrationRecord {
  id: string;
  vehicleId: string;
  command: VehicleBrainIntegrationCommand["command"];
  status: VehicleBrainIntegrationStatus;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
}
