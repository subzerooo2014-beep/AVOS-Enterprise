export type EnterprisePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EnterpriseInitiativeStatus =
  | "PLANNED"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "BLOCKED";

export interface EnterpriseStrategicInitiative {
  id: string;
  name: string;
  domain: string;
  objective: string;
  valueScore: number;
  urgencyScore: number;
  riskScore: number;
  dependencyCount: number;
  priority: EnterprisePriority;
  status: EnterpriseInitiativeStatus;
  createdAt: string;
}

export interface EnterpriseDependency {
  id: string;
  initiativeId: string;
  dependsOnInitiativeId: string;
  critical: boolean;
  createdAt: string;
}

export interface EnterpriseExecutionWave {
  id: string;
  name: string;
  initiativeIds: string[];
  sequence: number;
  readinessScore: number;
  approved: boolean;
  generatedAt: string;
}

export interface EnterpriseStrategySnapshot {
  initiatives: number;
  dependencies: number;
  executionWaves: number;
  activeInitiatives: number;
  blockedInitiatives: number;
  portfolioValueScore: number;
  strategyReadiness: number;
  generatedAt: string;
}