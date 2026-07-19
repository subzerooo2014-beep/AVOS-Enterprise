export type ProductionRegion =
  | "north-america"
  | "south-america"
  | "europe"
  | "middle-east"
  | "africa"
  | "asia-pacific"
  | "global";

export type FactoryStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "isolated"
  | "offline";

export type ComplianceDecision = "allowed" | "restricted" | "denied";
export type HumanDecision = "pending" | "approved" | "rejected";

export interface GlobalFactoryNode {
  id: string;
  name: string;
  region: ProductionRegion;
  countryCode: string;
  jurisdiction: string;
  capabilities: string[];
  supportedLanguages: string[];
  capacity: number;
  currentLoad: number;
  operationalCostIndex: number;
  energyCostIndex: number;
  carbonIntensityIndex: number;
  latencyIndex: number;
  healthScore: number;
  trustScore: number;
  blueprintCompatibility: number;
  disasterZone: string;
  status: FactoryStatus;
  sovereignDataClasses: string[];
  updatedAt: string;
}

export interface ProductionWorkload {
  id: string;
  objective: string;
  requiredCapabilities: string[];
  preferredRegions: ProductionRegion[];
  prohibitedCountries: string[];
  dataClassification: string;
  requestedCapacity: number;
  maximumCostIndex: number;
  maximumCarbonIndex: number;
  requiresHumanApproval: boolean;
  humanDecision: HumanDecision;
  status: "created" | "routed" | "replicating" | "executing" | "completed" | "failed";
  selectedFactoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceEvaluation {
  id: string;
  workloadId: string;
  factoryId: string;
  decision: ComplianceDecision;
  score: number;
  reasons: string[];
  evaluatedAt: string;
}

export interface RoutingDecision {
  id: string;
  workloadId: string;
  selectedFactoryId?: string;
  candidateScores: Array<{
    factoryId: string;
    totalScore: number;
    complianceDecision: ComplianceDecision;
  }>;
  status: "selected" | "blocked";
  requiresHumanApproval: boolean;
  createdAt: string;
}

export interface ReplicationPlan {
  id: string;
  workloadId: string;
  sourceFactoryId: string;
  targetFactoryIds: string[];
  strategy: "active-active" | "active-passive" | "multi-master";
  assets: string[];
  status: "planned" | "executing" | "completed" | "failed";
  createdAt: string;
}

export interface DisasterRecoveryPlan {
  id: string;
  primaryFactoryId: string;
  recoveryFactoryIds: string[];
  recoveryPointObjectiveMinutes: number;
  recoveryTimeObjectiveMinutes: number;
  status: "ready" | "activated" | "recovered" | "failed";
  lastTestedAt: string;
}

export interface IntelligenceForecast {
  id: string;
  horizonHours: number;
  predictedDemand: number;
  predictedCapacity: number;
  predictedRisk: number;
  recommendations: string[];
  createdAt: string;
}

export interface MarketplaceOffer {
  id: string;
  factoryId: string;
  capability: string;
  availableCapacity: number;
  unitCost: number;
  trustScore: number;
  active: boolean;
  createdAt: string;
}

export interface EconomySnapshot {
  id: string;
  totalEstimatedCost: number;
  utilizationRate: number;
  efficiencyScore: number;
  sustainabilityScore: number;
  createdAt: string;
}

export interface DigitalTwinSnapshot {
  id: string;
  factories: number;
  operationalFactories: number;
  workloads: number;
  activeReplications: number;
  recoveryPlansReady: number;
  globalHealthScore: number;
  createdAt: string;
}

export interface EvolutionProposal {
  id: string;
  title: string;
  rationale: string;
  expectedImpact: number;
  riskLevel: "low" | "medium" | "high";
  status: "proposed" | "approved" | "rejected" | "deployed";
  approvedBy?: string;
  createdAt: string;
}

export interface FinalReviewRecord {
  id: string;
  status: "passed" | "failed";
  score: number;
  checks: Array<{ name: string; passed: boolean }>;
  createdAt: string;
}

export interface CertificationRecord {
  id: string;
  status: "certified" | "not-certified";
  score: number;
  approvedBy: string;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
  globalProductionOperatingSystemComplete: boolean;
  nextStage: string;
  review: FinalReviewRecord;
  createdAt: string;
}