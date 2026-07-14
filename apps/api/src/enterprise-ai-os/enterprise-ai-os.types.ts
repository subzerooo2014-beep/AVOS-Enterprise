export type AiTaskStatus =
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type AiDecision =
  | "ALLOW"
  | "REVIEW"
  | "DENY"
  | "ESCALATE";

export interface AiAgentRecord {
  id: string;
  code: string;
  name: string;
  capability: string;
  active: boolean;
  priority: number;
  createdAt: string;
}

export interface AiTaskRecord {
  id: string;
  type: string;
  input: Record<string, unknown>;
  status: AiTaskStatus;
  assignedAgentId?: string;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeNode {
  id: string;
  type: string;
  label: string;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface MemoryRecord {
  id: string;
  namespace: string;
  key: string;
  value: Record<string, unknown>;
  importance: number;
  createdAt: string;
  updatedAt: string;
}
