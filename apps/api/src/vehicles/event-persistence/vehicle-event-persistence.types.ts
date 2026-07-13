export type VehicleEventStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface VehicleEventRecord {
  id: string;
  vehicleId: string;
  eventType: string;
  status: VehicleEventStatus;
  attempts: number;
  maxAttempts: number;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface VehicleEventAuditEntry {
  id: string;
  eventId: string;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
}
