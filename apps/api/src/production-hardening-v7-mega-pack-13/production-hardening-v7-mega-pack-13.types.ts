export type DataAssetStatus =
  | "draft"
  | "active"
  | "restricted"
  | "retired";

export type DataClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type RetentionPolicyStatus =
  | "draft"
  | "active"
  | "suspended"
  | "retired";

export type AccessReviewStatus =
  | "pending"
  | "approved"
  | "revoked"
  | "expired";

export type PrivacyRequestStatus =
  | "received"
  | "validated"
  | "processing"
  | "completed"
  | "rejected";

export type PrivacyRequestType =
  | "access"
  | "correction"
  | "deletion"
  | "restriction"
  | "export";

export interface DataAsset {
  id: string;
  name: string;
  description: string;
  domain: string;
  owner: string;
  steward: string;
  classification: DataClassification;
  status: DataAssetStatus;
  containsPersonalData: boolean;
  containsSensitiveData: boolean;
  sourceSystem: string;
  storageLocation: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  assetId: string;
  retentionDays: number;
  legalHoldEnabled: boolean;
  deletionEnabled: boolean;
  status: RetentionPolicyStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

export interface DataLineageNode {
  id: string;
  assetId: string;
  systemName: string;
  componentName: string;
  nodeType:
    | "source"
    | "processor"
    | "store"
    | "consumer"
    | "archive";
  createdAt: string;
}

export interface DataLineageEdge {
  id: string;
  assetId: string;
  fromNodeId: string;
  toNodeId: string;
  transformation: string;
  encrypted: boolean;
  createdAt: string;
}

export interface DataAccessReview {
  id: string;
  assetId: string;
  principal: string;
  role: string;
  businessJustification: string;
  status: AccessReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PrivacyRequest {
  id: string;
  subjectReference: string;
  requestType: PrivacyRequestType;
  assetIds: string[];
  status: PrivacyRequestStatus;
  requestedAt: string;
  validatedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  requestedBy: string;
}

export interface DataQualityRule {
  id: string;
  assetId: string;
  name: string;
  fieldName: string;
  ruleType:
    | "required"
    | "format"
    | "range"
    | "uniqueness"
    | "consistency";
  thresholdPercent: number;
  active: boolean;
  createdAt: string;
}

export interface DataQualityEvaluation {
  id: string;
  ruleId: string;
  assetId: string;
  measuredPercent: number;
  passed: boolean;
  message: string;
  evaluatedAt: string;
}

export interface GovernanceEvidenceEntry {
  id: string;
  sequence: number;
  eventType: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
}

export interface GovernancePlatformEvent {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface DataGovernanceSnapshot {
  generatedAt: string;
  healthStatus: "healthy" | "degraded" | "critical";
  evidenceChainVerified: boolean;
  dataAssets: number;
  activeDataAssets: number;
  restrictedDataAssets: number;
  personalDataAssets: number;
  retentionPolicies: number;
  activeRetentionPolicies: number;
  legalHolds: number;
  lineageNodes: number;
  lineageEdges: number;
  accessReviews: number;
  approvedAccessReviews: number;
  revokedAccessReviews: number;
  privacyRequests: number;
  completedPrivacyRequests: number;
  rejectedPrivacyRequests: number;
  dataQualityRules: number;
  activeDataQualityRules: number;
  dataQualityEvaluations: number;
  passedDataQualityEvaluations: number;
  failedDataQualityEvaluations: number;
  evidenceEntries: number;
  platformEvents: number;
}
