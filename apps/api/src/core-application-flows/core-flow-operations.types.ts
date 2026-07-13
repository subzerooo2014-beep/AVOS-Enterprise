export type CoreFlowOperationStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "dead-lettered"
  | "compensated";

export type CoreFlowOperation = {
  id: string;
  flow: string;
  correlationId: string;
  aggregateType: string;
  aggregateId: string;
  status: CoreFlowOperationStatus;
  payload: Record<string, unknown>;
  result?: unknown;
  error?: string;
  attempts: number;
  maxAttempts: number;
  priority: number;
  nextAttemptAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CoreFlowAuditEntry = {
  id: string;
  operationId: string;
  action: string;
  actor: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type CoreFlowSnapshot = {
  id: string;
  operationId: string;
  version: number;
  state: Record<string, unknown>;
  createdAt: string;
};
