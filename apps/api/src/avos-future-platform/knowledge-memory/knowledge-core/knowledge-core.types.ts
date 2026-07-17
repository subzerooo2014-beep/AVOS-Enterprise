export type KnowledgeCoreStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface KnowledgeCoreCapability {
  id: string;
  name: string;
  group: string;
  status: KnowledgeCoreStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}