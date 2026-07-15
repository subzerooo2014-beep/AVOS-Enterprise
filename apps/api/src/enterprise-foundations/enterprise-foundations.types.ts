export type FoundationDomain =
  | "DATA_AI"
  | "RUNTIME_INTEGRATION"
  | "IDENTITY_MULTI_TENANCY"
  | "DEVELOPER_API_PLUGIN"
  | "LEGAL_GLOBAL_OPERATIONS"
  | "SECURITY_OBSERVABILITY_EXPERIENCE";

export interface FoundationCapability {
  key: string;
  name: string;
  domain: FoundationDomain;
  reusable: boolean;
  multiIndustry: boolean;
  active: boolean;
}

export interface FoundationRegistration {
  id: string;
  tenantId: string;
  domain: FoundationDomain;
  capabilityKey: string;
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DataAssetRegistration {
  id: string;
  tenantId: string;
  name: string;
  type: "DATASET" | "MODEL" | "FEATURE" | "KNOWLEDGE_GRAPH";
  owner: string;
  lineage: string[];
  qualityScore: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeJob {
  id: string;
  tenantId: string;
  name: string;
  type: "QUEUE" | "SCHEDULED" | "SAGA" | "WORKFLOW";
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "DEAD_LETTER";
  idempotencyKey: string;
  attempts: number;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityContext {
  id: string;
  tenantId: string;
  subjectId: string;
  subjectType: "USER" | "SERVICE" | "MACHINE";
  roles: string[];
  attributes: Record<string, string>;
  mfaVerified: boolean;
  consentGranted: boolean;
  dataResidencyRegion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperAsset {
  id: string;
  tenantId: string;
  type: "API" | "SDK" | "PLUGIN" | "CONNECTOR" | "WEBHOOK" | "BLUEPRINT";
  name: string;
  version: string;
  status: "DRAFT" | "PUBLISHED" | "DEPRECATED";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface LegalOperationPolicy {
  id: string;
  tenantId: string;
  jurisdiction: string;
  policyKey: string;
  version: string;
  active: boolean;
  effectiveFrom: string;
  retentionDays?: number;
  dataResidencyRegion?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityObservation {
  id: string;
  tenantId: string;
  category:
    | "LOG"
    | "METRIC"
    | "TRACE"
    | "THREAT"
    | "INCIDENT"
    | "ACCESSIBILITY"
    | "EXPERIENCE";
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  source: string;
  message: string;
  metadata: Record<string, unknown>;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}