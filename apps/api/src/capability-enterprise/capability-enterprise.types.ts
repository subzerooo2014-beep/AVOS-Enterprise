export type CapabilityApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVOKED";

export type CapabilityCertificationLevel =
  | "FOUNDATION"
  | "STANDARD"
  | "ENTERPRISE"
  | "MISSION_CRITICAL";

export type CapabilityPublicationStatus =
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "SUSPENDED"
  | "WITHDRAWN";

export type CapabilityComplianceStatus =
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NON_COMPLIANT"
  | "NOT_EVALUATED";

export interface CapabilityTenantBinding {
  id: string;
  capabilityKey: string;
  tenantId: string;
  enabled: boolean;
  configuration: Record<string, unknown>;
  policyOverrides: string[];
  quota: {
    maxExecutionsPerHour: number;
    maxConcurrentExecutions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityApprovalRequest {
  id: string;
  capabilityKey: string;
  requestedBy: string;
  requestedAction:
    | "ACTIVATE"
    | "PUBLISH"
    | "CERTIFY"
    | "MIGRATE"
    | "ARCHIVE";
  justification: string;
  status: CapabilityApprovalStatus;
  decidedBy?: string;
  decisionReason?: string;
  requestedAt: string;
  decidedAt?: string;
}

export interface CapabilityCertification {
  id: string;
  capabilityKey: string;
  level: CapabilityCertificationLevel;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  qualityThreshold: number;
  trustThreshold: number;
  riskCeiling: number;
  evidence: string[];
  certifiedBy: string;
  certifiedAt: string;
  expiresAt?: string;
}

export interface CapabilityPublication {
  id: string;
  capabilityKey: string;
  channel: "INTERNAL" | "PARTNER" | "PUBLIC" | "MARKETPLACE";
  status: CapabilityPublicationStatus;
  displayName: string;
  summary: string;
  version: string;
  termsRef?: string;
  documentationRef?: string;
  publishedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityComplianceEvaluation {
  id: string;
  capabilityKey: string;
  status: CapabilityComplianceStatus;
  score: number;
  controlsEvaluated: number;
  controlsPassed: number;
  findings: string[];
  evidence: Record<string, unknown>;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface CapabilityAuditEntry {
  id: string;
  capabilityKey: string;
  action: string;
  actor: string;
  tenantId?: string;
  outcome: "SUCCESS" | "DENIED" | "FAILED";
  details: Record<string, unknown>;
  occurredAt: string;
}

export interface CapabilityMigrationPlan {
  id: string;
  capabilityKey: string;
  fromVersion: string;
  toVersion: string;
  strategy: "IN_PLACE" | "BLUE_GREEN" | "CANARY" | "REPLACE";
  steps: string[];
  rollbackSteps: string[];
  approvalRequestId?: string;
  status: "DRAFT" | "APPROVED" | "EXECUTING" | "COMPLETED" | "ROLLED_BACK";
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityArchiveRecord {
  id: string;
  capabilityKey: string;
  reason: string;
  replacementCapabilityKey?: string;
  retainedEvidence: string[];
  archivedBy: string;
  archivedAt: string;
}

export interface CapabilityEnterpriseSnapshot {
  tenantBindings: number;
  pendingApprovals: number;
  activeCertifications: number;
  publishedCapabilities: number;
  compliantCapabilities: number;
  migrations: number;
  archivedCapabilities: number;
  auditEntries: number;
  generatedAt: string;
}