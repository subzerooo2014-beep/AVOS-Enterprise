export type WorkflowState =
  | "CREATED"
  | "RUNNING"
  | "RETRYING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type WorkflowPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "CRITICAL";

export interface WorkflowMetadata {
  version: string;
  owner?: string;
  tags?: string[];
}

export interface WorkflowExecutionSummary {
  workflowId: string;
  executionId: string;
  state: WorkflowState;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}
