export type KnowledgeNodeType =
  | "capability"
  | "product"
  | "workflow"
  | "agent"
  | "service"
  | "api"
  | "event"
  | "decision"
  | "policy"
  | "data"
  | "organization"
  | "customer"
  | "asset"
  | "knowledge"
  | "document"
  | "model"
  | "integration";

export type KnowledgeNodeStatus =
  | "active"
  | "inactive"
  | "deprecated"
  | "archived";

export type KnowledgeRelationshipType =
  | "depends-on"
  | "provides"
  | "consumes"
  | "triggers"
  | "produces"
  | "governed-by"
  | "owned-by"
  | "derived-from"
  | "related-to"
  | "supports"
  | "contradicts"
  | "implements"
  | "exposes"
  | "uses"
  | "belongs-to"
  | "supersedes";

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  canonicalName: string;
  displayName: string;
  description: string;
  status: KnowledgeNodeStatus;
  identityId?: string;
  sourceSystem: string;
  domain: string;
  tags: string[];
  attributes: Record<string, unknown>;
  confidence: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeRelationship {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: KnowledgeRelationshipType;
  label: string;
  strength: number;
  confidence: number;
  bidirectional: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SemanticSearchQuery {
  text?: string;
  nodeTypes?: KnowledgeNodeType[];
  domains?: string[];
  tags?: string[];
  status?: KnowledgeNodeStatus[];
  minConfidence?: number;
  limit?: number;
}

export interface SemanticSearchResult {
  node: KnowledgeNode;
  score: number;
  reasons: string[];
}

export interface GraphTraversalRequest {
  startNodeId: string;
  relationshipTypes?: KnowledgeRelationshipType[];
  maxDepth: number;
  direction: "outgoing" | "incoming" | "both";
  includeStartNode: boolean;
}

export interface GraphTraversalResult {
  startNodeId: string;
  nodeIds: string[];
  relationshipIds: string[];
  paths: string[][];
  maxDepthReached: number;
  traversedAt: string;
}

export interface KnowledgeQualityFinding {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "orphan-node"
    | "duplicate-node"
    | "low-confidence"
    | "missing-description"
    | "invalid-relationship"
    | "circular-relationship"
    | "weak-connectivity";
  subjectId: string;
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface KnowledgeGraphVersion {
  id: string;
  version: number;
  nodeIds: string[];
  relationshipIds: string[];
  changeSummary: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface KnowledgeGraphSnapshot {
  id: string;
  name: string;
  version: number;
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  checksum: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface KnowledgeGraphReplayResult {
  id: string;
  snapshotId: string;
  replayedNodeIds: string[];
  replayedRelationshipIds: string[];
  conflicts: string[];
  replayedByIdentityId: string;
  replayedAt: string;
}

export interface KnowledgeGraphHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    coverageScore: number;
    connectivityScore: number;
    qualityScore: number;
    confidenceScore: number;
    integrityScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KnowledgeGraphAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "node"
    | "relationship"
    | "search"
    | "traversal"
    | "quality"
    | "version"
    | "snapshot"
    | "replay"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
