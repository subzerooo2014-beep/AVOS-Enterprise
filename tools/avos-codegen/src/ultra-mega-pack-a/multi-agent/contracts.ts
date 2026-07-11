import {
  UltraFinding,
  UltraValue,
} from "../contracts";

export enum AgentTaskStatus {
  CREATED = "created",
  ASSIGNED = "assigned",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface CollaborationAgent {
  id: string;
  key: string;
  name: string;
  capabilities: string[];
  capacity: number;
  activeTasks: number;
  metadata: Record<string, UltraValue>;
}

export interface CollaborationTask {
  id: string;
  key: string;
  description: string;
  requiredCapabilities: string[];
  dependencies: string[];
  priority: number;
  status: AgentTaskStatus;
  assignedAgentId?: string;
  input: Record<string, UltraValue>;
}

export interface CollaborationExecution {
  taskId: string;
  agentId: string;
  success: boolean;
  output: Record<string, UltraValue>;
  findings: UltraFinding[];
  startedAt: string;
  completedAt: string;
}

export interface CollaborationPlan {
  assignments: {
    taskId: string;
    agentId: string;
  }[];
  unassignedTasks: string[];
  generatedAt: string;
}
