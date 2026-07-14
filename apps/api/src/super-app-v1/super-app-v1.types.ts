export type AgentType =
  | "VEHICLE"
  | "FINANCE"
  | "INSURANCE"
  | "WORKSHOP"
  | "EXPORT"
  | "MARKET"
  | "NEGOTIATION"
  | "TRUST";

export type WorkflowStatus =
  | "CREATED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface UserMemoryRecord {
  userId: string;
  preferredCategories: string[];
  preferredBudget?: number;
  preferredCities: string[];
  viewedVehicles: string[];
  favoriteVehicles: string[];
  lastQueries: string[];
  updatedAt: string;
}

export interface AgentResult {
  agent: AgentType;
  success: boolean;
  score: number;
  summary: string;
  recommendations: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: WorkflowStatus;
  result?: Record<string, unknown>;
}

export interface SuperAppWorkflow {
  id: string;
  userId: string;
  intent: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  agentResults: AgentResult[];
  createdAt: string;
  completedAt?: string;
}