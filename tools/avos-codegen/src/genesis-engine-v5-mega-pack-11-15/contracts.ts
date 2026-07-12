export type V5AgentPrimitive = string | number | boolean | null;
export type V5AgentValue =
  | V5AgentPrimitive
  | V5AgentValue[]
  | { [key: string]: V5AgentValue };

export enum V5AgentRuntimeStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5WorkflowInput {
  key: string;
  trigger: string;
  goals: string[];
  domains: string[];
  criticality?: "low" | "medium" | "high";
}

export interface V5AgentInput {
  key: string;
  role: string;
  goals: string[];
  tools: string[];
  memoryRequired?: boolean;
  humanApprovalRequired?: boolean;
}

export interface V5AgentRuntimeInput {
  systemKey: string;
  workflows: V5WorkflowInput[];
  agents: V5AgentInput[];
  enableGuardrails?: boolean;
  enableHumanApproval?: boolean;
  enableMemory?: boolean;
}

export interface V5WorkflowDefinition {
  key: string;
  trigger: string;
  steps: Array<{
    order: number;
    key: string;
    type: "agent" | "tool" | "decision" | "approval" | "event";
    target: string;
    retryAttempts: number;
    compensation?: string;
  }>;
  completionEvent: string;
}

export interface V5AgentDefinition {
  key: string;
  role: string;
  goals: string[];
  allowedTools: string[];
  memoryMode: "none" | "short-term" | "persistent";
  approvalMode: "automatic" | "human-required";
}

export interface V5ToolContract {
  key: string;
  description: string;
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  riskLevel: "low" | "medium" | "high";
}

export interface V5GuardrailPolicy {
  key: string;
  appliesTo: string[];
  rule: string;
  action: "block" | "review" | "allow-with-evidence";
}
