export type FoundationRecordStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "superseded"
  | "certified";

export type ContractKind = "api" | "event" | "capability";

export interface MetadataRecord {
  id: string;
  assetId: string;
  assetType: string;
  canonicalName: string;
  description: string;
  domain: string;
  owner: string;
  steward: string;
  tags: string[];
  classifications: string[];
  sensitivity: "public" | "internal" | "confidential" | "restricted";
  jurisdictionScope: string[];
  sourceSystem: string;
  version: string;
  status: FoundationRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DataAssetRecord {
  id: string;
  canonicalName: string;
  description: string;
  dataDomain: string;
  owner: string;
  steward: string;
  sourceSystem: string;
  schemaVersion: string;
  format: string;
  location: string;
  retentionPolicy: string;
  classification: string;
  jurisdictionScope: string[];
  qualityScore: number;
  status: FoundationRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DataLineageEdge {
  id: string;
  fromAssetId: string;
  toAssetId: string;
  transformation: string;
  processOwner: string;
  evidence: string[];
  createdAt: string;
}

export interface DataQualityRule {
  id: string;
  dataAssetId: string;
  name: string;
  dimension:
    | "accuracy"
    | "completeness"
    | "consistency"
    | "timeliness"
    | "validity"
    | "uniqueness";
  expression: string;
  threshold: number;
  severity: "info" | "low" | "medium" | "high" | "critical";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DataQualityResult {
  id: string;
  dataAssetId: string;
  ruleId: string;
  passed: boolean;
  score: number;
  observedValue: number;
  threshold: number;
  evidence: Record<string, unknown>;
  evaluatedAt: string;
}

export interface MasterDataRecord {
  id: string;
  entityType: string;
  canonicalKey: string;
  canonicalValue: Record<string, unknown>;
  sourceRecords: Array<{
    sourceSystem: string;
    sourceId: string;
    confidence: number;
  }>;
  survivorshipRules: string[];
  version: string;
  status: FoundationRecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContractRecord {
  id: string;
  kind: ContractKind;
  name: string;
  namespace: string;
  version: string;
  owner: string;
  description: string;
  schema: Record<string, unknown>;
  compatibilityMode:
    | "backward"
    | "forward"
    | "full"
    | "none";
  lifecycle: FoundationRecordStatus;
  jurisdictionScope: string[];
  policies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractCompatibilityResult {
  id: string;
  currentContractId: string;
  candidateVersion: string;
  compatible: boolean;
  mode: ContractRecord["compatibilityMode"];
  breakingChanges: string[];
  warnings: string[];
  evaluatedAt: string;
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