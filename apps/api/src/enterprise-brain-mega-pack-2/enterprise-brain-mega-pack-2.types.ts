export type BrainKnowledgeNodeType =
  | "concept"
  | "entity"
  | "capability"
  | "service"
  | "workflow"
  | "decision"
  | "policy"
  | "event"
  | "document"
  | "memory";

export type BrainKnowledgeRelationType =
  | "depends-on"
  | "implements"
  | "extends"
  | "contains"
  | "produces"
  | "consumes"
  | "governs"
  | "relates-to"
  | "derived-from"
  | "contradicts"
  | "supports";

export type BrainMemoryType =
  | "working"
  | "operational"
  | "episodic"
  | "semantic"
  | "long-term"
  | "contextual";

export type BrainMemoryStatus =
  | "active"
  | "consolidating"
  | "archived"
  | "expired"
  | "deleted";

export interface BrainKnowledgeNode {
  id: string;
  type: BrainKnowledgeNodeType;
  name: string;
  description: string;
  aliases: string[];
  properties: Record<string, unknown>;
  tags: string[];
  sourceIds: string[];
  confidence: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrainKnowledgeRelation {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: BrainKnowledgeRelationType;
  weight: number;
  confidence: number;
  evidenceIds: string[];
  metadata: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrainOntology {
  id: string;
  name: string;
  version: string;
  description: string;
  conceptIds: string[];
  relationTypes: BrainKnowledgeRelationType[];
  rules: Array<{
    id: string;
    description: string;
    expression: string;
    active: boolean;
  }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrainKnowledgeIndexEntry {
  id: string;
  nodeId: string;
  tokens: string[];
  semanticVector: number[];
  searchableText: string;
  rank: number;
  indexedAt: string;
}

export interface BrainMemoryRecord {
  id: string;
  type: BrainMemoryType;
  ownerIdentityId?: string;
  sessionId?: string;
  organizationId?: string;
  subject: string;
  content: unknown;
  summary: string;
  tags: string[];
  relatedKnowledgeNodeIds: string[];
  importance: number;
  confidence: number;
  retentionScore: number;
  status: BrainMemoryStatus;
  sensitive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface BrainMemoryRetrievalResult {
  memoryId: string;
  score: number;
  reasons: string[];
  memory: BrainMemoryRecord;
}

export interface BrainKnowledgeSearchResult {
  nodeId: string;
  score: number;
  reasons: string[];
  node: BrainKnowledgeNode;
}

export interface BrainMemoryConsolidation {
  id: string;
  sourceMemoryIds: string[];
  targetMemoryId: string;
  strategy: "merge" | "summarize" | "promote" | "archive";
  status: "planned" | "running" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export interface BrainKnowledgeValidationReport {
  id: string;
  valid: boolean;
  score: number;
  orphanNodes: string[];
  duplicateNodes: string[];
  brokenRelations: string[];
  contradictions: string[];
  warnings: string[];
  createdAt: string;
}

export interface BrainKnowledgeMemoryHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    knowledgeGraphScore: number;
    ontologyScore: number;
    semanticIndexScore: number;
    memoryCoverageScore: number;
    consolidationScore: number;
    validationScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainKnowledgeAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "knowledge"
    | "relation"
    | "ontology"
    | "index"
    | "memory"
    | "retrieval"
    | "consolidation"
    | "validation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
