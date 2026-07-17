export type KnowledgeGraphStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface KnowledgeGraphCapability {
  id: string;
  name: string;
  group: string;
  status: KnowledgeGraphStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}