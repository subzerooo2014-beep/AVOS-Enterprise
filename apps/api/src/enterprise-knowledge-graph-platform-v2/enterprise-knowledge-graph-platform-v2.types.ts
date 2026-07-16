export interface KnowledgeGraphEntityV2 {
  id: string;
  type: string;
  name: string;
  description?: string;
  properties: Record<string, unknown>;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGraphRelationV2 {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  weight: number;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface KnowledgeGraphLineageV2 {
  id: string;
  entityId: string;
  source: string;
  operation: string;
  previousVersion?: number;
  currentVersion: number;
  createdAt: string;
}

export interface KnowledgeInferenceV2 {
  id: string;
  entityId: string;
  rule: string;
  conclusion: string;
  confidence: number;
  evidence: string[];
  createdAt: string;
}

export interface KnowledgeSearchResultV2 {
  id: string;
  name: string;
  type: string;
  score: number;
  matchedFields: string[];
}

export interface KnowledgeGraphMetricsV2 {
  entities: number;
  relations: number;
  lineageRecords: number;
  inferences: number;
  searches: number;
  connectedEntities: number;
  orphanEntities: number;
}

export interface KnowledgeGraphHealthV2 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: KnowledgeGraphMetricsV2;
  components: Record<string, string>;
}
