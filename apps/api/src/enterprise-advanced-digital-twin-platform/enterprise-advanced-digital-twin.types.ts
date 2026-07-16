export type AdvancedTwinType =
  | "ASSET"
  | "PROCESS"
  | "ORGANIZATION"
  | "CUSTOMER"
  | "MARKET"
  | "SYSTEM";

export interface AdvancedTwinRecord {
  id: string;
  name: string;
  twinType: AdvancedTwinType;
  sourceId: string;
  status: "ACTIVE" | "PAUSED" | "DEGRADED" | "RETIRED";
  state: Record<string, unknown>;
  capabilities: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TwinStateSnapshotRecord {
  id: string;
  twinId: string;
  state: Record<string, unknown>;
  source: string;
  version: number;
  createdAt: string;
}

export interface TwinSynchronizationRecord {
  id: string;
  twinId: string;
  source: string;
  status: "STARTED" | "COMPLETED" | "FAILED";
  fieldsUpdated: string[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface TwinScenarioRecord {
  id: string;
  twinId: string;
  name: string;
  assumptions: Record<string, unknown>;
  createdAt: string;
}

export interface TwinSimulationResultRecord {
  id: string;
  twinId: string;
  scenarioId: string;
  score: number;
  risk: number;
  impact: number;
  outputs: Record<string, unknown>;
  simulatedAt: string;
}

export interface TwinInsightRecord {
  id: string;
  twinId: string;
  category: string;
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  title: string;
  description: string;
  createdAt: string;
}

export interface AdvancedTwinMetrics {
  twins: number;
  activeTwins: number;
  degradedTwins: number;
  snapshots: number;
  synchronizations: number;
  failedSynchronizations: number;
  scenarios: number;
  simulations: number;
  insights: number;
  criticalInsights: number;
}

export interface AdvancedTwinHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AdvancedTwinMetrics;
  components: Record<string, string>;
}
