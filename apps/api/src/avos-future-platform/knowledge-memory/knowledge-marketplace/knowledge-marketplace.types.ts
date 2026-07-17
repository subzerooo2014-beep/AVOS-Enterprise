export type KnowledgeMarketplaceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface KnowledgeMarketplaceCapability {
  id: string;
  name: string;
  group: string;
  status: KnowledgeMarketplaceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}