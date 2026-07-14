export type ExecutionStatus =
  | "QUEUED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "RECOVERING";

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  step: number;
  status: ExecutionStatus;
  payload: Record<string, unknown>;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeHealthRecord {
  id: string;
  component: string;
  score: number;
  state: "HEALTHY" | "DEGRADED" | "FAILED";
  checkedAt: string;
}
