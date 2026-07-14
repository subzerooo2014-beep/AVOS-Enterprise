export type KnowledgeStatus = "DRAFT" | "ACTIVE" | "DEPRECATED" | "ARCHIVED";

export interface KnowledgeRecord {
  id: string;
  domain: string;
  title: string;
  content: string;
  version: number;
  status: KnowledgeStatus;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeProvenanceRecord {
  id: string;
  knowledgeId: string;
  sourceType: string;
  sourceReference: string;
  confidence: number;
  createdAt: string;
}
