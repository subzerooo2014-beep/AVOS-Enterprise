export interface KnowledgeNode {
  id: string;
  type: string;
  title: string;
  content: string;
  version: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight: number;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  source?: string;
  tags: string[];
  version: number;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface VectorMemoryRecord {
  id: string;
  namespace: string;
  text: string;
  vector: number[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
  enabled: boolean;
}

export interface RetrievalResult {
  id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeMetrics {
  nodes: number;
  edges: number;
  documents: number;
  vectorMemories: number;
  prompts: number;
  searches: number;
  retrievals: number;
  reasoningSessions: number;
}

export interface KnowledgeHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: KnowledgeMetrics;
  components: Record<string, string>;
}
