export type MetadataAssetType =
  | "capability"
  | "product"
  | "agent"
  | "workflow"
  | "decision"
  | "knowledge"
  | "data"
  | "service"
  | "integration"
  | "policy"
  | "model"
  | "api"
  | "event"
  | "document";

export type MetadataSensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type MetadataStatus =
  | "active"
  | "draft"
  | "deprecated"
  | "archived";

export type MetadataRelationType =
  | "derived-from"
  | "produced-by"
  | "consumed-by"
  | "validated-by"
  | "owned-by"
  | "classified-by"
  | "governed-by"
  | "references"
  | "supersedes";

export interface UnifiedMetadataRecord {
  id: string;
  assetId: string;
  assetType: MetadataAssetType;
  canonicalName: string;
  displayName: string;
  description: string;
  version: string;
  schemaVersion: string;
  status: MetadataStatus;
  sensitivity: MetadataSensitivity;
  domain: string;
  sourceSystem: string;
  ownerIdentityId: string;
  tags: string[];
  classifications: string[];
  attributes: Record<string, unknown>;
  qualityScore: number;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataClassificationRule {
  id: string;
  name: string;
  description: string;
  field: string;
  operator:
    | "equals"
    | "contains"
    | "exists"
    | "matches"
    | "in";
  value?: unknown;
  classification: string;
  confidence: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataDiscoveryResult {
  id: string;
  sourceSystem: string;
  assetId: string;
  assetType: MetadataAssetType;
  discoveredFields: string[];
  suggestedTags: string[];
  suggestedClassifications: string[];
  confidence: number;
  discoveredAt: string;
}

export interface MetadataLineageEdge {
  id: string;
  fromMetadataId: string;
  toMetadataId: string;
  relation: MetadataRelationType;
  reason: string;
  actorIdentityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface MetadataQualityFinding {
  id: string;
  metadataId: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "missing-owner"
    | "missing-description"
    | "missing-domain"
    | "missing-version"
    | "low-confidence"
    | "low-quality"
    | "duplicate-record"
    | "orphan-record";
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface MetadataPolicy {
  id: string;
  name: string;
  description: string;
  applicableAssetTypes: MetadataAssetType[];
  minimumQualityScore: number;
  minimumConfidence: number;
  requireOwner: boolean;
  requireDomain: boolean;
  requireClassification: boolean;
  allowedSensitivities: MetadataSensitivity[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataSearchQuery {
  text?: string;
  assetTypes?: MetadataAssetType[];
  domains?: string[];
  tags?: string[];
  classifications?: string[];
  sensitivities?: MetadataSensitivity[];
  minQualityScore?: number;
  minConfidence?: number;
  limit?: number;
}

export interface MetadataSearchResult {
  record: UnifiedMetadataRecord;
  score: number;
  reasons: string[];
}

export interface MetadataHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    completenessScore: number;
    qualityScore: number;
    classificationCoverageScore: number;
    lineageCoverageScore: number;
    policyComplianceScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface MetadataAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "catalog"
    | "classification"
    | "discovery"
    | "lineage"
    | "quality"
    | "policy"
    | "search"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
