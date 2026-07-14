export type JobStatus =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "DEAD_LETTER";

export interface PartnerCredential {
  id: string;
  partnerId: string;
  keyId: string;
  secretMasked: string;
  active: boolean;
  createdAt: string;
  rotatedAt?: string;
}

export interface IntegrationJob {
  id: string;
  idempotencyKey: string;
  correlationId: string;
  partnerId: string;
  requestId: string;
  jobType: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  availableAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  correlationId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: "IN_APP" | "PUSH" | "EMAIL";
  status: "QUEUED" | "SENT" | "FAILED";
  createdAt: string;
}
