export type RuntimeAgent =
  | "VEHICLE"
  | "FINANCE"
  | "INSURANCE"
  | "WORKSHOP"
  | "MARKET"
  | "NEGOTIATION"
  | "TRUST";

export type RuntimeEventType =
  | "WORKFLOW_STARTED"
  | "AGENT_STARTED"
  | "AGENT_COMPLETED"
  | "AGENT_FAILED"
  | "WORKFLOW_COMPLETED";

export interface RuntimeEvent {
  id: string;
  workflowId: string;
  type: RuntimeEventType;
  agent?: RuntimeAgent;
  message: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface RuntimeAgentResult {
  agent: RuntimeAgent;
  success: boolean;
  score: number;
  durationMs: number;
  attempts: number;
  summary: string;
}

export interface RuntimeWorkflow {
  id: string;
  userId: string;
  intent: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt?: string;
  results: RuntimeAgentResult[];
  overallScore: number;
}