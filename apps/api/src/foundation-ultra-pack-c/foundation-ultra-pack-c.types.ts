export type RecordStatus =
  | "draft"
  | "active"
  | "suspended"
  | "deprecated"
  | "certified";

export interface GovernancePolicy {
  id: string;
  code: string;
  name: string;
  description: string;
  domain:
    | "governance"
    | "security"
    | "privacy"
    | "compliance"
    | "data"
    | "ai"
    | "operations";
  scope: string[];
  jurisdictionScope: string[];
  rules: Array<{
    field: string;
    operator:
      | "equals"
      | "not-equals"
      | "contains"
      | "in"
      | "gte"
      | "lte"
      | "exists";
    value?: unknown;
    message: string;
  }>;
  enforcement:
    | "advisory"
    | "mandatory"
    | "blocking";
  priority: number;
  version: string;
  status: RecordStatus;
  owner: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyEvaluation {
  id: string;
  policyId: string;
  subject: string;
  passed: boolean;
  score: number;
  violations: string[];
  evidence: Record<string, unknown>;
  evaluatedAt: string;
}

export interface SecurityControl {
  id: string;
  code: string;
  name: string;
  category:
    | "identity"
    | "access"
    | "encryption"
    | "secrets"
    | "zero-trust"
    | "monitoring"
    | "incident-response";
  description: string;
  mandatory: boolean;
  implementationStatus:
    | "planned"
    | "implemented"
    | "verified";
  owner: string;
  evidence: string[];
  jurisdictionScope: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessDecision {
  id: string;
  principalId: string;
  resourceId: string;
  action: string;
  context: Record<string, unknown>;
  allowed: boolean;
  reason: string;
  trustScore: number;
  policyCodes: string[];
  decidedAt: string;
}

export interface SecretRecord {
  id: string;
  name: string;
  owner: string;
  encryptedValue: string;
  algorithm: string;
  keyReference: string;
  rotationIntervalDays: number;
  lastRotatedAt: string;
  expiresAt?: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyConsent {
  id: string;
  subjectId: string;
  purpose: string;
  dataCategories: string[];
  jurisdiction: string;
  granted: boolean;
  lawfulBasis: string;
  source: string;
  version: string;
  grantedAt?: string;
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyRequest {
  id: string;
  subjectId: string;
  requestType:
    | "access"
    | "rectification"
    | "erasure"
    | "restriction"
    | "portability"
    | "objection";
  jurisdiction: string;
  status:
    | "received"
    | "verified"
    | "processing"
    | "completed"
    | "rejected";
  dueAt: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceEvidence {
  id: string;
  controlCode: string;
  jurisdiction: string;
  artifactType: string;
  artifactReference: string;
  hash: string;
  collectedBy: string;
  collectedAt: string;
  validUntil?: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  assetId?: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface CertificationRecord {
  id: string;
  version: string;
  status: "not-certified" | "certified" | "rejected";
  score: number;
  approvedBy?: string;
  checks: Record<string, boolean>;
  createdAt: string;
}