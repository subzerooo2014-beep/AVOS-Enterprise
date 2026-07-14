export type Phase6Status = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface CapabilityGenome {
  id: string;
  domain: string;
  capabilities: string[];
  fitnessScore: number;
  createdAt: string;
}

export interface ValueCreationPlan {
  id: string;
  opportunity: string;
  expectedValue: number;
  confidence: number;
  approved: boolean;
  createdAt: string;
}

export interface DemandWave {
  id: string;
  market: string;
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  generatedAt: string;
}