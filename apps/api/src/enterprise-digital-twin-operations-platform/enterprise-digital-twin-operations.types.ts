export type OperationalTwinType = "ASSET" | "PROCESS";

export interface OperationalTwinRecord {
  id: string;
  name: string;
  twinType: OperationalTwinType;
  sourceId: string;
  status: "ACTIVE" | "DEGRADED" | "OFFLINE" | "RETIRED";
  state: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TwinStateEventRecord {
  id: string;
  twinId: string;
  source: string;
  patch: Record<string, unknown>;
  previousVersion: number;
  currentVersion: number;
  createdAt: string;
}

export interface TwinReplayRecord {
  id: string;
  twinId: string;
  fromVersion: number;
  toVersion: number;
  reconstructedState: Record<string, unknown>;
  createdAt: string;
}

export interface PredictiveTwinInsightRecord {
  id: string;
  twinId: string;
  category: string;
  score: number;
  confidence: number;
  summary: string;
  factors: string[];
  createdAt: string;
}

export interface TwinHealthRecord {
  twinId: string;
  score: number;
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  issues: string[];
  checkedAt: string;
}

export interface DigitalTwinOperationsMetrics {
  twins: number;
  assetTwins: number;
  processTwins: number;
  activeTwins: number;
  degradedTwins: number;
  stateEvents: number;
  replays: number;
  predictiveInsights: number;
  unhealthyTwins: number;
}

export interface DigitalTwinOperationsHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: DigitalTwinOperationsMetrics;
  components: Record<string, string>;
}
