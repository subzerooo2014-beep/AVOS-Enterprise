export type PersistenceOperationStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "RETRYING";

export interface PersistenceOperation {
  id: string;
  name: string;
  repository?: string;
  status: PersistenceOperationStatus;
  attempts: number;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface PersistenceEvent {
  id: string;
  type: string;
  aggregate: string;
  aggregateId?: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface PersistenceRuntimeMetrics {
  totalOperations: number;
  completedOperations: number;
  failedOperations: number;
  retriedOperations: number;
  activeOperations: number;
  cacheEntries: number;
  emittedEvents: number;
  averageDurationMs: number;
}

export interface PersistenceRuntimeHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: PersistenceRuntimeMetrics;
  components: Record<string, string>;
}
