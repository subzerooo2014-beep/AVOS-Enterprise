export type MarketplaceCreatorAiStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MarketplaceCreatorAiCapability {
  id: string;
  name: string;
  group: string;
  status: MarketplaceCreatorAiStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}