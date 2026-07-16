export interface FoundationIntegrationV1 {
  id: string;
  name: string;
  type: "API" | "WEBHOOK" | "SDK" | "CONNECTOR";
  endpoint: string;
  version: string;
  status: "ACTIVE" | "DEGRADED" | "DISABLED";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationDataGovernancePolicyV1 {
  id: string;
  domain: string;
  classification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  retentionDays: number;
  residency: string[];
  owner: string;
  enabled: boolean;
  updatedAt: string;
}

export interface FoundationDataQualityRuleV1 {
  id: string;
  dataset: string;
  field: string;
  ruleType: "REQUIRED" | "TYPE" | "RANGE" | "PATTERN" | "UNIQUENESS";
  expected: unknown;
  enabled: boolean;
  updatedAt: string;
}

export interface FoundationAuditRecordV1 {
  id: string;
  actor: string;
  action: string;
  resource: string;
  payloadHash: string;
  previousHash?: string;
  integrityHash: string;
  createdAt: string;
}

export interface FoundationSecurityFindingV1 {
  id: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: string;
  description: string;
  status: "OPEN" | "MITIGATED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface FoundationHaNodeV1 {
  id: string;
  region: string;
  role: "PRIMARY" | "REPLICA";
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  lastHeartbeatAt: string;
}

export interface FoundationUpdateReleaseV1 {
  id: string;
  version: string;
  channel: "STABLE" | "CANARY" | "EXPERIMENTAL";
  status: "DRAFT" | "READY" | "DEPLOYING" | "DEPLOYED" | "ROLLED_BACK";
  compatibilityRange: string;
  artifacts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundationEvolutionProposalV1 {
  id: string;
  title: string;
  category: string;
  status: "PROPOSED" | "APPROVED" | "EXECUTING" | "COMPLETED" | "REJECTED";
  score: number;
  dependencies: string[];
  rationale: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationMemoryRecordV1 {
  id: string;
  namespace: string;
  key: string;
  value: Record<string, unknown>;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationKnowledgeEntityV1 {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationKnowledgeRelationV1 {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  relationType: string;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface FoundationDigitalTwinV1 {
  id: string;
  sourceId: string;
  twinType: "ASSET" | "PROCESS" | "ORGANIZATION";
  state: Record<string, unknown>;
  version: number;
  status: "ACTIVE" | "DEGRADED" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
}

export interface FoundationFinalMetricsV1 {
  integrations: number;
  governancePolicies: number;
  qualityRules: number;
  auditRecords: number;
  securityFindings: number;
  criticalFindings: number;
  haNodes: number;
  healthyNodes: number;
  releases: number;
  evolutionProposals: number;
  memoryRecords: number;
  knowledgeEntities: number;
  knowledgeRelations: number;
  digitalTwins: number;
}

export interface FoundationFinalStatusV1 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: FoundationFinalMetricsV1;
  components: Record<string, string>;
}
