export type Phase4Status = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface DigitalTwinState {
  id: string;
  domain: string;
  version: number;
  healthScore: number;
  synchronizedAt: string;
}

export interface DecisionNode {
  id: string;
  name: string;
  rationale: string;
  confidence: number;
  approved: boolean;
  createdAt: string;
}

export interface LearningRecord {
  id: string;
  signal: string;
  lesson: string;
  confidence: number;
  createdAt: string;
}