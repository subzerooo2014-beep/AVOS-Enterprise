export type DecisionStatus = "DRAFT" | "PROPOSED" | "APPROVED" | "REJECTED" | "EXECUTED";

export interface StrategicGoalRecord {
  id: string;
  title: string;
  description: string;
  priority: number;
  ownerId?: string;
  status: DecisionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionRecord {
  id: string;
  goalId?: string;
  title: string;
  rationale: string;
  confidence: number;
  status: DecisionStatus;
  createdAt: string;
  updatedAt: string;
}
