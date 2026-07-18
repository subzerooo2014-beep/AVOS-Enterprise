export type AvosFactoryInsightSeverity =
  | "info"
  | "warning"
  | "critical";

export type AvosFactoryRecommendationStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "implemented";

export interface AvosFactoryQualityScore {
  architecture: number;
  maintainability: number;
  scalability: number;
  security: number;
  documentation: number;
  reliability: number;
  reuse: number;
  overall: number;
  calculatedAt: string;
}

export interface AvosFactoryGenerationAnalysis {
  id: string;
  subjectId: string;
  actor: string;
  source: "manual" | "operations" | "synchronization" | "smoke";
  success: boolean;
  durationMs: number;
  filesGenerated: number;
  warnings: string[];
  failures: string[];
  reusedCapabilities: string[];
  templateId?: string;
  blueprintId?: string;
  quality: AvosFactoryQualityScore;
  patterns: string[];
  analyzedAt: string;
}

export interface AvosFactoryRecommendation {
  id: string;
  subjectId: string;
  category:
    | "template"
    | "blueprint"
    | "capability"
    | "quality"
    | "performance"
    | "governance";
  title: string;
  description: string;
  rationale: string[];
  expectedImpact: number;
  confidence: number;
  severity: AvosFactoryInsightSeverity;
  status: AvosFactoryRecommendationStatus;
  proposedBy: string;
  approvedBy?: string;
  humanApproved: boolean;
  createdAt: string;
  decidedAt?: string;
}

export interface AvosFactoryTemplateIntelligence {
  templateId: string;
  uses: number;
  successes: number;
  failures: number;
  successRate: number;
  averageQuality: number;
  averageDurationMs: number;
  rankingScore: number;
  lastUsedAt?: string;
}

export interface AvosFactoryBlueprintIntelligence {
  blueprintId: string;
  uses: number;
  averageQuality: number;
  architectureScore: number;
  duplicationRisk: number;
  complexityRisk: number;
  recommendations: string[];
  calculatedAt: string;
}

export interface AvosFactoryCapabilityIntelligence {
  capabilityId: string;
  uses: number;
  successfulUses: number;
  failedUses: number;
  reuseScore: number;
  trustScore: number;
  maturityScore: number;
  mergeCandidates: string[];
  calculatedAt: string;
}

export interface AvosFactoryLearningMemoryRecord {
  id: string;
  subjectId: string;
  memoryType:
    | "success-pattern"
    | "failure-pattern"
    | "quality-pattern"
    | "reuse-pattern"
    | "recommendation-outcome";
  summary: string;
  evidence: Record<string, unknown>;
  confidence: number;
  createdAt: string;
}

export interface AvosFactoryEnterpriseInsights {
  totalAnalyses: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageQuality: number;
  averageDurationMs: number;
  topTemplates: AvosFactoryTemplateIntelligence[];
  topCapabilities: AvosFactoryCapabilityIntelligence[];
  activeRecommendations: number;
  criticalRecommendations: number;
  learningRecords: number;
  trends: string[];
  generatedAt: string;
}

export interface AvosFactoryIntelligenceSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
