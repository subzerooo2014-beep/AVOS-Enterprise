export type V5SupremePrimitive = string | number | boolean | null;
export type V5SupremeValue =
  | V5SupremePrimitive
  | V5SupremeValue[]
  | { [key: string]: V5SupremeValue };

export enum V5SupremeStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5RegionInput {
  key: string;
  country: string;
  primary: boolean;
  dataResidencyRequired: boolean;
  latencyTargetMs: number;
}

export interface V5DataDomainInput {
  key: string;
  classification: "public" | "internal" | "confidential" | "restricted";
  streamingRequired: boolean;
  analyticsRequired: boolean;
}

export interface V5AiAssetInput {
  key: string;
  type: "model" | "prompt" | "agent";
  riskLevel: "low" | "medium" | "high";
  owner: string;
}

export interface V5SupremeRuntimeInput {
  systemKey: string;
  regions: V5RegionInput[];
  dataDomains: V5DataDomainInput[];
  aiAssets: V5AiAssetInput[];
  services: string[];
  monthlyBudget: number;
  recoveryTier: "standard" | "critical" | "mission-critical";
  enableDeveloperPlatform?: boolean;
  enableFinOps?: boolean;
  enableEcosystem?: boolean;
}

export interface V5RegionTopology {
  regionKey: string;
  role: "primary" | "secondary";
  routingWeight: number;
  replicationMode: "synchronous" | "asynchronous";
  residencyEnforced: boolean;
}

export interface V5DataPlatformPlan {
  lakehouseZones: string[];
  streamingTopics: string[];
  featureStores: string[];
  retentionPolicies: Array<{
    domainKey: string;
    retentionDays: number;
  }>;
}

export interface V5AiGovernancePolicy {
  assetKey: string;
  approvalRequired: boolean;
  evaluationGates: string[];
  monitoringRequired: boolean;
}

export interface V5DeveloperPlatformPlan {
  serviceCatalog: string[];
  goldenPaths: string[];
  templates: string[];
  qualityGates: string[];
}

export interface V5ReleasePlan {
  trains: string[];
  strategies: string[];
  rollbackSignals: string[];
  promotionGates: string[];
}

export interface V5RecoveryPlan {
  rpoMinutes: number;
  rtoMinutes: number;
  backupFrequencyMinutes: number;
  restoreTestsPerMonth: number;
}

export interface V5FinOpsPlan {
  monthlyBudget: number;
  allocationKeys: string[];
  anomalyThresholdPercent: number;
  forecastHorizonMonths: number;
}
