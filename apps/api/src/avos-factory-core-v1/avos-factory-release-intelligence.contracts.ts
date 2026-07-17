export type AvosFactoryReleaseIntelligenceLevel =
  | "excellent"
  | "stable"
  | "watch"
  | "high-risk";

export type AvosFactoryImprovementPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface AvosFactoryDeploymentLearningSignal {
  id: string;
  deploymentExecutionId: string;
  deploymentPlanId: string;
  reportId: string;
  signalType:
    | "success-pattern"
    | "risk-pattern"
    | "rollback-pattern"
    | "performance-pattern"
    | "verification-pattern";
  title: string;
  description: string;
  confidence: number;
  evidence: Record<string, string | number | boolean>;
  createdAt: string;
}

export interface AvosFactoryReleaseIntelligenceReport {
  id: string;
  deploymentExecutionId: string;
  deploymentPlanId: string;
  releaseHealthReportId: string;
  score: number;
  level: AvosFactoryReleaseIntelligenceLevel;
  riskProbability: number;
  successProbability: number;
  learningSignals: AvosFactoryDeploymentLearningSignal[];
  recommendations: string[];
  generatedAt: string;
}

export interface AvosFactoryImprovementAction {
  id: string;
  intelligenceReportId: string;
  deploymentPlanId: string;
  title: string;
  description: string;
  priority: AvosFactoryImprovementPriority;
  status: "proposed" | "approved" | "implemented" | "rejected";
  humanApprovalRequired: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvosFactoryReleaseLearningMemory {
  id: string;
  subjectId: string;
  version: string;
  deploymentPlanId: string;
  deploymentExecutionId: string;
  healthScore: number;
  intelligenceScore: number;
  outcome: "successful" | "degraded" | "rolled-back" | "failed";
  lessons: string[];
  createdAt: string;
}

export interface AvosFactoryReleaseIntelligenceSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
