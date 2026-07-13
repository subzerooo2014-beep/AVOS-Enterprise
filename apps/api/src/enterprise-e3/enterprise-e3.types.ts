export type EnterpriseTaskStatus =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface EnterpriseTaskRecord {
  id: string;
  type: string;
  status: EnterpriseTaskStatus;
  attempts: number;
  maxAttempts: number;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseTelemetryRecord {
  id: string;
  category: string;
  metric: string;
  value: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
