export type ProcessNodeStatus =
  | "pending"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "compensated";

export type ProcessNode = {
  id: string;
  name: string;
  dependsOn: string[];
  status: ProcessNodeStatus;
  input?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  timeoutMs?: number;
  startedAt?: string;
  completedAt?: string;
};

export type ProcessDefinition = {
  id: string;
  name: string;
  version: number;
  active: boolean;
  nodes: ProcessNode[];
  createdAt: string;
};

export type ProcessExecution = {
  id: string;
  definitionId: string;
  definitionVersion: number;
  correlationId: string;
  status: "running" | "completed" | "failed" | "timed-out" | "compensated";
  nodes: ProcessNode[];
  context: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
};

export type ApprovalGate = {
  id: string;
  executionId: string;
  nodeId: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  reason?: string;
};
