export type BrainExperienceOutcome =
  | "success"
  | "partial"
  | "failure";

export type BrainFeedbackType =
  | "human"
  | "system"
  | "performance"
  | "quality"
  | "risk"
  | "business";

export type BrainLearningStatus =
  | "observed"
  | "validated"
  | "learned"
  | "rejected"
  | "applied";

export interface BrainExperienceRecord {
  id: string;
  sourceType: string;
  sourceId: string;
  context: Record<string, unknown>;
  actions: string[];
  outcome: BrainExperienceOutcome;
  score: number;
  lessons: string[];
  evidenceIds: string[];
  createdAt: string;
}

export interface BrainFeedbackRecord {
  id: string;
  type: BrainFeedbackType;
  sourceIdentityId?: string;
  subjectId: string;
  rating: number;
  message: string;
  labels: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface BrainPatternRecord {
  id: string;
  name: string;
  category: string;
  sourceExperienceIds: string[];
  frequency: number;
  confidence: number;
  impact: "low" | "medium" | "high" | "critical";
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrainLearningRecord {
  id: string;
  title: string;
  description: string;
  sourcePatternIds: string[];
  sourceFeedbackIds: string[];
  status: BrainLearningStatus;
  confidence: number;
  proposedChanges: string[];
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  appliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainPrediction {
  id: string;
  subjectId: string;
  horizon: "immediate" | "short" | "medium" | "long";
  prediction: string;
  probability: number;
  confidence: number;
  drivers: string[];
  assumptions: string[];
  risks: string[];
  createdAt: string;
}

export interface BrainRecommendation {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  expectedValue: number;
  confidence: number;
  actions: string[];
  risks: string[];
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  status: "proposed" | "approved" | "rejected" | "implemented";
  createdAt: string;
  updatedAt: string;
}

export interface BrainRiskAssessment {
  id: string;
  subjectId: string;
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  factors: Array<{
    name: string;
    weight: number;
    score: number;
  }>;
  mitigations: string[];
  requiresHumanApproval: boolean;
  createdAt: string;
}

export interface BrainOpportunity {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  valueScore: number;
  feasibilityScore: number;
  urgencyScore: number;
  confidence: number;
  requirements: string[];
  risks: string[];
  status: "detected" | "validated" | "approved" | "rejected";
  approvedByIdentityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainScenario {
  id: string;
  name: string;
  baseline: Record<string, number>;
  assumptions: Record<string, number>;
  outcomes: Record<string, number>;
  score: number;
  riskScore: number;
  recommendation: string;
  createdAt: string;
}

export interface BrainLearningIntelligenceHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    experienceScore: number;
    feedbackScore: number;
    patternScore: number;
    learningScore: number;
    predictionScore: number;
    recommendationScore: number;
    riskScore: number;
    opportunityScore: number;
    simulationScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainLearningAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "experience"
    | "feedback"
    | "pattern"
    | "learning"
    | "prediction"
    | "recommendation"
    | "risk"
    | "opportunity"
    | "simulation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
