export interface StrategicPlanRecord {
  id: string;
  name: string;
  objective: string;
  owner: string;
  horizonMonths: number;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  priorities: string[];
  assumptions: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicScenarioRecord {
  id: string;
  planId: string;
  name: string;
  variables: Record<string, number>;
  probability: number;
  createdAt: string;
}

export interface StrategicForecastRecord {
  id: string;
  planId: string;
  scenarioId: string;
  revenueImpact: number;
  costImpact: number;
  growthImpact: number;
  riskScore: number;
  confidence: number;
  createdAt: string;
}

export interface PortfolioInitiativeRecord {
  id: string;
  planId: string;
  name: string;
  strategicValue: number;
  cost: number;
  risk: number;
  urgency: number;
  priorityScore: number;
  status: "PROPOSED" | "APPROVED" | "EXECUTING" | "COMPLETED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface StrategyExecutionRecord {
  id: string;
  initiativeId: string;
  progressPercent: number;
  milestone: string;
  status: "ON_TRACK" | "AT_RISK" | "BLOCKED" | "COMPLETED";
  updatedAt: string;
}

export interface StrategicRiskSimulationRecord {
  id: string;
  planId: string;
  scenarioId: string;
  downsideScore: number;
  upsideScore: number;
  resilienceScore: number;
  findings: string[];
  simulatedAt: string;
}

export interface StrategicPlanningMetrics {
  plans: number;
  activePlans: number;
  scenarios: number;
  forecasts: number;
  initiatives: number;
  approvedInitiatives: number;
  executingInitiatives: number;
  executionRecords: number;
  riskSimulations: number;
  blockedExecutions: number;
}

export interface StrategicPlanningHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: StrategicPlanningMetrics;
  components: Record<string, string>;
}
