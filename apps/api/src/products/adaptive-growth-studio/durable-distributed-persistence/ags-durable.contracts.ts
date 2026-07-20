export interface AgsDurableWorkflowStep {
  key: string;
  capabilityKey: string;
  operation: string;
  payload: Record<string, unknown>;
  compensationOperation?: string;
}

export interface AgsCreateDurableWorkflow {
  name: string;
  objective: string;
  riskLevel?: "low" | "medium" | "high" | "critical";
  steps: AgsDurableWorkflowStep[];
  requestedBy?: string;
}

export interface AgsEnqueueJob {
  queue?: string;
  type: string;
  payload: Record<string, unknown>;
  priority?: number;
  maxAttempts?: number;
  availableAt?: string;
  idempotencyKey?: string;
  correlationId?: string;
}