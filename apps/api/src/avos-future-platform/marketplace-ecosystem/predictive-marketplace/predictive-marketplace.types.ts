export type PredictiveMarketplaceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PredictiveMarketplaceCapability {
  id: string;
  name: string;
  group: string;
  status: PredictiveMarketplaceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}