export type AgsUltimateRisk = "low" | "medium" | "high" | "critical";

export type AgsWorkflowState =
  | "created"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "compensating"
  | "compensated"
  | "cancelled";

export type AgsAgentStatus = "idle" | "busy" | "degraded" | "offline";

export interface AgsCapabilityInvocation {
  id: string;
  workflowId?: string;
  capabilityKey: string;
  operation: string;
  payload: Record<string, unknown>;
  requestedBy: string;
  status: "queued" | "running" | "completed" | "failed";
  attempts: number;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgsWorkflowStep {
  key: string;
  capabilityKey: string;
  operation: string;
  payload: Record<string, unknown>;
  compensationOperation?: string;
}

export interface AgsWorkflow {
  id: string;
  name: string;
  objective: string;
  state: AgsWorkflowState;
  riskLevel: AgsUltimateRisk;
  steps: AgsWorkflowStep[];
  currentStep: number;
  completedSteps: string[];
  failedStep?: string;
  requestedBy: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgsTelemetryEvent {
  id: string;
  type: string;
  source: string;
  correlationId?: string;
  severity: "debug" | "info" | "warning" | "error" | "critical";
  data: Record<string, unknown>;
  timestamp: string;
}

export interface AgsLearningOutcome {
  id: string;
  workflowId: string;
  objective: string;
  success: boolean;
  score: number;
  observations: string[];
  recommendations: string[];
  createdAt: string;
}

export interface AgsStrategyProfile {
  key: string;
  version: number;
  score: number;
  executions: number;
  successfulExecutions: number;
  parameters: Record<string, unknown>;
  updatedAt: string;
}

export interface AgsAgent {
  key: string;
  name: string;
  role: string;
  capabilities: string[];
  status: AgsAgentStatus;
  reliability: number;
}

export interface AgsAgentTask {
  id: string;
  objective: string;
  assignedAgent: string;
  status: "queued" | "running" | "completed" | "failed";
  output?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgsPlatformAlert {
  id: string;
  severity: "warning" | "critical";
  source: string;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}