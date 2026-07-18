export type AvosFactoryReleaseHealthLevel =
  | "excellent"
  | "healthy"
  | "degraded"
  | "critical";

export type AvosFactoryRecoveryDecision =
  | "none"
  | "observe"
  | "rollback-recommended"
  | "rollback-approved"
  | "recovery-completed";

export interface AvosFactoryReleaseHealthMetric {
  name: string;
  value: number;
  minimum: number;
  weight: number;
  passed: boolean;
}

export interface AvosFactoryReleaseHealthReport {
  id: string;
  deploymentExecutionId: string;
  deploymentPlanId: string;
  environment: string;
  score: number;
  level: AvosFactoryReleaseHealthLevel;
  metrics: AvosFactoryReleaseHealthMetric[];
  blockingFindings: string[];
  generatedAt: string;
}

export interface AvosFactoryPostDeploymentVerification {
  id: string;
  deploymentExecutionId: string;
  deploymentPlanId: string;
  success: boolean;
  checks: Record<string, boolean>;
  reportId: string;
  verifiedBy: string;
  verifiedAt: string;
}

export interface AvosFactoryRecoveryRecommendation {
  id: string;
  deploymentExecutionId: string;
  deploymentPlanId: string;
  reportId: string;
  decision: AvosFactoryRecoveryDecision;
  reason: string;
  humanApprovalRequired: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvosFactoryReleaseHealthSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
