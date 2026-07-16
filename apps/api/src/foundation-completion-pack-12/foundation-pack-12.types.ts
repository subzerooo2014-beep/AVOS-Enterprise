export type EnterpriseMemoryType =
  | "operational"
  | "architectural"
  | "decision"
  | "knowledge"
  | "capability"
  | "workflow"
  | "incident"
  | "learning"
  | "context";

export type EnterpriseMemoryStatus =
  | "active"
  | "archived"
  | "superseded"
  | "expired"
  | "deleted";

export type EnterpriseMemorySensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type MemoryRelationType =
  | "derived-from"
  | "caused-by"
  | "supports"
  | "contradicts"
  | "supersedes"
  | "references"
  | "belongs-to"
  | "generated-by"
  | "validated-by"
  | "replayed-from";

export type RetentionAction =
  | "retain"
  | "archive"
  | "expire"
  | "delete";

export interface EnterpriseMemoryRecord {
  id: string;
  type: EnterpriseMemoryType;
  title: string;
  description: string;
  subjectId: string;
  subjectType: string;
  correlationId: string;
  sourceIdentityId: string;
  ownerIdentityId: string;
  status: EnterpriseMemoryStatus;
  sensitivity: EnterpriseMemorySensitivity;
  content: Record<string, unknown>;
  summary: string;
  tags: string[];
  version: number;
  parentMemoryId?: string;
  retentionPolicyId?: string;
  checksum: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  expiresAt?: string;
}

export interface MemoryRelation {
  id: string;
  fromMemoryId: string;
  toMemoryId: string;
  relation: MemoryRelationType;
  strength: number;
  reason: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface MemoryContext {
  id: string;
  name: string;
  purpose: string;
  correlationId: string;
  memoryIds: string[];
  assembledByIdentityId: string;
  relevanceScores: Record<string, number>;
  tokenBudget?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface MemoryRetrievalQuery {
  text?: string;
  types?: EnterpriseMemoryType[];
  tags?: string[];
  subjectId?: string;
  correlationId?: string;
  ownerIdentityId?: string;
  status?: EnterpriseMemoryStatus[];
  limit?: number;
}

export interface MemoryRetrievalResult {
  memory: EnterpriseMemoryRecord;
  score: number;
  reasons: string[];
}

export interface MemoryRetentionPolicy {
  id: string;
  name: string;
  description: string;
  memoryTypes: EnterpriseMemoryType[];
  sensitivityLevels: EnterpriseMemorySensitivity[];
  retentionDays: number;
  archiveAfterDays?: number;
  actionAfterRetention: RetentionAction;
  legalHold: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryVersionRecord {
  id: string;
  memoryId: string;
  version: number;
  snapshot: EnterpriseMemoryRecord;
  changeSummary: string;
  changedByIdentityId: string;
  createdAt: string;
}

export interface MemoryReplayResult {
  id: string;
  sourceMemoryId: string;
  replayMemoryId: string;
  equivalentContent: boolean;
  equivalentContext: boolean;
  differences: string[];
  replayedByIdentityId: string;
  replayedAt: string;
}

export interface KnowledgeContinuitySnapshot {
  id: string;
  name: string;
  memoryIds: string[];
  contextIds: string[];
  relationIds: string[];
  checksum: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface MemoryIntegrityFinding {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "checksum-mismatch"
    | "missing-parent"
    | "missing-relation-target"
    | "orphan-memory"
    | "expired-active-memory"
    | "invalid-version-chain";
  memoryId: string;
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface MemoryHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    integrityScore: number;
    continuityScore: number;
    retrievalCoverageScore: number;
    retentionComplianceScore: number;
    contextCoverageScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface MemoryAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "memory"
    | "relation"
    | "context"
    | "retrieval"
    | "retention"
    | "version"
    | "replay"
    | "continuity"
    | "integrity"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
