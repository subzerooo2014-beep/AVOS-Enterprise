export type AvosFactoryDeploymentEnvironment =
  | "development"
  | "testing"
  | "staging"
  | "production";

export type AvosFactoryDeploymentPlanStatus =
  | "draft"
  | "validated"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rolled-back"
  | "rejected";

export interface AvosFactoryPromotionPolicy {
  id: string;
  name: string;
  sourceEnvironment: AvosFactoryDeploymentEnvironment;
  targetEnvironment: AvosFactoryDeploymentEnvironment;
  minimumCertificateScore: number;
  requireReleaseApproval: boolean;
  requireHumanApproval: boolean;
  allowAutomaticRollback: boolean;
  maximumRiskScore: number;
  enabled: boolean;
  createdAt: string;
}

export interface AvosFactoryDeploymentTarget {
  environment: AvosFactoryDeploymentEnvironment;
  region?: string;
  tenantId?: string;
  channel?: string;
}

export interface AvosFactoryDeploymentPlan {
  id: string;
  subjectId: string;
  certificateId: string;
  version: string;
  sourceEnvironment: AvosFactoryDeploymentEnvironment;
  target: AvosFactoryDeploymentTarget;
  strategy: "rolling" | "blue-green" | "canary" | "direct";
  riskScore: number;
  rollbackEnabled: boolean;
  status: AvosFactoryDeploymentPlanStatus;
  requestedBy: string;
  approvedBy?: string;
  humanApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvosFactoryPromotionDecision {
  id: string;
  planId: string;
  decision: "approved" | "rejected";
  actor: string;
  approvedBy: string;
  humanApproved: boolean;
  reason: string;
  decidedAt: string;
}

export interface AvosFactoryDeploymentExecution {
  id: string;
  planId: string;
  startedBy: string;
  status: "running" | "completed" | "failed" | "rolled-back";
  steps: Array<{
    name: string;
    success: boolean;
    details: string;
    completedAt: string;
  }>;
  startedAt: string;
  completedAt?: string;
}

export interface AvosFactoryRollbackRecord {
  id: string;
  planId: string;
  executionId: string;
  actor: string;
  reason: string;
  success: boolean;
  createdAt: string;
}

export interface AvosFactoryDeploymentSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
