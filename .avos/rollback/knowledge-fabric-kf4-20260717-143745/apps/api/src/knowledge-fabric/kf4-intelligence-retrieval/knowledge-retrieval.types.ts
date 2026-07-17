export type KnowledgeSearchMode = "keyword" | "graph" | "hybrid";

export interface KnowledgeSearchInput {
  query: string;
  mode?: KnowledgeSearchMode;
  limit?: number;
  minScore?: number;
}

export interface KnowledgeSearchResult {
  id: string;
  kind: "document" | "node";
  title: string;
  summary: string;
  score: number;
  sourceId?: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeContextInput extends KnowledgeSearchInput {
  maxCharacters?: number;
}

export interface KnowledgeContextResult {
  query: string;
  context: string;
  citations: Array<{
    id: string;
    title: string;
    kind: "document" | "node";
    score: number;
  }>;
  resultCount: number;
  generatedAt: string;
}

export interface KnowledgeRetrievalStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-4";
  name: "Intelligence & Retrieval";
  status: "ready";
  searchReady: boolean;
  rankingReady: boolean;
  contextBuilderReady: boolean;
  graphRetrievalReady: boolean;
  indexedDocuments: number;
  indexedNodes: number;
  capabilities: string[];
  generatedAt: string;
}