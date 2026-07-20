export type AeosGoalStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface AeosGoal {
  id: string;
  title: string;
  description: string;
  priority: number;
  owner: string;
  status: AeosGoalStatus;
  objectives: Array<{
    key: string;
    weight: number;
    target: number;
    direction: "maximize" | "minimize";
  }>;
  constraints: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AeosPlanStep {
  id: string;
  name: string;
  targetUnit: string;
  action: string;
  dependencies: string[];
  estimatedCost: number;
  estimatedValue: number;
  risk: "low" | "medium" | "high" | "critical";
  requiresHumanApproval: boolean;
}

export interface AeosPlan {
  id: string;
  goalId: string;
  version: number;
  status: "proposed" | "approved" | "executing" | "completed" | "failed";
  steps: AeosPlanStep[];
  score: number;
  createdAt: string;
}

export interface AeosDecisionOption {
  id: string;
  label: string;
  metrics: Record<string, number>;
  risk: number;
  cost: number;
  reversibility: number;
}

export interface AeosDecision {
  id: string;
  goalId: string;
  selectedOptionId: string;
  rankedOptions: Array<AeosDecisionOption & { score: number }>;
  requiresHumanApproval: boolean;
  confidence: number;
  decidedAt: string;
}