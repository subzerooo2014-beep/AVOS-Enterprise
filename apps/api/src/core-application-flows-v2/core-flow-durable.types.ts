export type DurableExecutionStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "dead-lettered";

export type DurableExecution = {
  id: string;
  flow: string;
  correlationId: string;
  payload: Record<string, unknown>;
  status: DurableExecutionStatus;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt?: string;
  lockedBy?: string;
  lockedUntil?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};

export type DurableCheckpoint = {
  id: string;
  executionId: string;
  name: string;
  state: Record<string, unknown>;
  createdAt: string;
};

export type DurableSchedule = {
  id: string;
  executionId: string;
  executeAt: string;
  status: "scheduled" | "dispatched" | "cancelled";
  createdAt: string;
};
