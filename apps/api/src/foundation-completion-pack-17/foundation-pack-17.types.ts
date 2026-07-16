export type FoundationCapabilityDomain =
  | "identity"
  | "memory"
  | "knowledge"
  | "metadata"
  | "digital-dna"
  | "digital-genome"
  | "contracts"
  | "dependencies"
  | "governance"
  | "trust"
  | "architecture"
  | "orchestration";

export type FoundationSdkOperationType =
  | "query"
  | "command"
  | "validation"
  | "health"
  | "discovery";

export type FoundationSdkStatus =
  | "active"
  | "disabled"
  | "deprecated";

export interface FoundationSdkCapability {
  id: string;
  name: string;
  description: string;
  domain: FoundationCapabilityDomain;
  version: string;
  status: FoundationSdkStatus;
  operationTypes: FoundationSdkOperationType[];
  endpoint?: string;
  providerModule: string;
  contractId?: string;
  dependencies: string[];
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationApiContract {
  id: string;
  name: string;
  version: string;
  domain: FoundationCapabilityDomain;
  requestSchema: Record<string, unknown>;
  responseSchema: Record<string, unknown>;
  guarantees: string[];
  constraints: string[];
  compatibilityVersions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationSdkRequest {
  requestId: string;
  capabilityId: string;
  operation: string;
  operationType: FoundationSdkOperationType;
  actorIdentityId: string;
  correlationId: string;
  payload: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface FoundationSdkResponse {
  requestId: string;
  capabilityId: string;
  success: boolean;
  data?: unknown;
  error?: string;
  metadata: {
    domain: FoundationCapabilityDomain;
    version: string;
    executedAt: string;
    durationMs: number;
  };
}

export interface FoundationCapabilityDiscoveryQuery {
  text?: string;
  domains?: FoundationCapabilityDomain[];
  operationTypes?: FoundationSdkOperationType[];
  tags?: string[];
  status?: FoundationSdkStatus[];
  limit?: number;
}

export interface FoundationCapabilityDiscoveryResult {
  capability: FoundationSdkCapability;
  score: number;
  reasons: string[];
}

export interface FoundationSdkDiagnosticFinding {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "missing-contract"
    | "missing-provider"
    | "missing-dependency"
    | "duplicate-capability"
    | "invalid-version"
    | "inactive-dependency"
    | "unreachable-capability";
  subjectId: string;
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface FoundationSdkHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    capabilityCoverageScore: number;
    contractCoverageScore: number;
    dependencyIntegrityScore: number;
    diagnosticsScore: number;
    operationalReadinessScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface FoundationSdkAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "capability"
    | "contract"
    | "discovery"
    | "gateway"
    | "diagnostics"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
