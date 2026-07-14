export type UnifiedRuntimeStatus =
  | "CREATED"
  | "MATCHED"
  | "NEGOTIATING"
  | "INTEGRATIONS_STARTED"
  | "JOBS_QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface UnifiedRuntimeRecord {
  id: string;
  dealId: string;
  buyerId: string;
  sellerId: string;
  vehicleId: string;
  userId: string;
  status: UnifiedRuntimeStatus;
  correlationId: string;
  integrationRequestIds: string[];
  jobIds: string[];
  notificationIds: string[];
  completedSteps: string[];
  failedStep?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}
