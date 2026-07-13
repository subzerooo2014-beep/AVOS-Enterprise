export type CoreFlowStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "CONVERTED"
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED";

export type CoreFlowResult<T = unknown> = {
  success: true;
  flow: string;
  idempotencyKey: string;
  timestamp: string;
  result: T;
};

export type CoreFlowEvent = {
  id: string;
  type: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
};

export type CoreWorkflowExecution = {
  id: string;
  name: string;
  status: "running" | "completed" | "failed";
  steps: Array<{
    name: string;
    status: "pending" | "completed" | "failed";
    output?: unknown;
  }>;
  startedAt: string;
  completedAt?: string;
};
