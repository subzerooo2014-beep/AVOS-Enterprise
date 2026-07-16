export interface AiAgentRecord {
  id: string;
  name: string;
  role: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  skills: string[];
  tools: string[];
  policies: string[];
}

export interface AiSkillRecord {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
}

export interface AiToolRecord {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AiMemoryRecord {
  id: string;
  scope: string;
  key: string;
  value: unknown;
  version: number;
  updatedAt: string;
}

export interface AiTaskRecord {
  id: string;
  objective: string;
  agentId?: string;
  status: "PLANNED" | "RUNNING" | "COMPLETED" | "FAILED" | "BLOCKED";
  steps: string[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface AiExecutionRecord {
  id: string;
  taskId: string;
  agentId: string;
  toolId?: string;
  status: "STARTED" | "COMPLETED" | "FAILED" | "DENIED";
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface AiPolicyRecord {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  effect: "ALLOW" | "DENY" | "REVIEW";
  conditions: Record<string, unknown>;
}

export interface AiPlatformMetrics {
  agents: number;
  skills: number;
  tools: number;
  memories: number;
  tasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  executions: number;
  deniedExecutions: number;
  policies: number;
}

export interface AiPlatformHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AiPlatformMetrics;
  components: Record<string, string>;
}
