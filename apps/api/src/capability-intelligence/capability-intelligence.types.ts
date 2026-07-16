export type CapabilityInsightSeverity =
  | "INFO"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type CapabilityRecommendationType =
  | "REUSE"
  | "MERGE"
  | "OPTIMIZE"
  | "EVOLVE"
  | "DEPRECATE"
  | "SECURE"
  | "OBSERVE"
  | "DOCUMENT"
  | "SPLIT"
  | "REPLACE";

export interface CapabilityKnowledgeRecord {
  capabilityKey: string;
  summary: string;
  businessValue: string;
  contracts: string[];
  dependencies: string[];
  tags: string[];
  lifecycleStage: string;
  operationalStatus: string;
  version: string;
  updatedAt: string;
}

export interface CapabilityMemoryEvent {
  id: string;
  capabilityKey: string;
  type:
    | "REGISTERED"
    | "ACTIVATED"
    | "EXECUTED"
    | "FAILED"
    | "EVOLVED"
    | "VERSION_RELEASED"
    | "INSIGHT_GENERATED"
    | "RECOMMENDATION_GENERATED";
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface CapabilityUsageProfile {
  capabilityKey: string;
  runtimeInstances: number;
  totalExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageDurationMs: number;
  orchestrationReferences: number;
  dependencyReferences: number;
  reuseScore: number;
  updatedAt: string;
}

export interface CapabilityScoreBreakdown {
  architecture: number;
  runtime: number;
  observability: number;
  security: number;
  governance: number;
  reuse: number;
  documentation: number;
}

export interface CapabilityIntelligenceScore {
  capabilityKey: string;
  qualityIndex: number;
  trustScore: number;
  maturityScore: number;
  riskScore: number;
  technicalDebtScore: number;
  reuseScore: number;
  breakdown: CapabilityScoreBreakdown;
  evaluatedAt: string;
}

export interface CapabilityDuplicateMatch {
  sourceCapabilityKey: string;
  candidateCapabilityKey: string;
  similarity: number;
  matchedSignals: string[];
  recommendation: "REVIEW" | "MERGE" | "KEEP_SEPARATE";
}

export interface CapabilityRecommendation {
  id: string;
  capabilityKey: string;
  type: CapabilityRecommendationType;
  severity: CapabilityInsightSeverity;
  title: string;
  rationale: string;
  expectedValue: string;
  actions: string[];
  confidence: number;
  generatedAt: string;
}

export interface CapabilityRiskSignal {
  code: string;
  severity: CapabilityInsightSeverity;
  message: string;
  evidence: Record<string, unknown>;
}

export interface CapabilityInsight {
  capabilityKey: string;
  score: CapabilityIntelligenceScore;
  usage: CapabilityUsageProfile;
  risks: CapabilityRiskSignal[];
  duplicates: CapabilityDuplicateMatch[];
  recommendations: CapabilityRecommendation[];
  generatedAt: string;
}

export interface CapabilityIntelligenceSnapshot {
  capabilitiesAnalyzed: number;
  averageQualityIndex: number;
  averageTrustScore: number;
  averageMaturityScore: number;
  averageRiskScore: number;
  averageTechnicalDebtScore: number;
  recommendations: number;
  duplicateCandidates: number;
  memoryEvents: number;
  knowledgeRecords: number;
  generatedAt: string;
}