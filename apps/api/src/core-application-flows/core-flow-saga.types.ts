export type SagaStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "compensated";

export type SagaStep = {
  name: string;
  status: SagaStepStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  startedAt?: string;
  completedAt?: string;
};

export type SagaExecution = {
  id: string;
  name: string;
  correlationId: string;
  aggregateType: string;
  aggregateId: string;
  status: "running" | "completed" | "failed" | "compensated";
  currentStep: number;
  steps: SagaStep[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type FlowSchedule = {
  id: string;
  operationId: string;
  executeAt: string;
  status: "scheduled" | "dispatched" | "cancelled";
  createdAt: string;
};
