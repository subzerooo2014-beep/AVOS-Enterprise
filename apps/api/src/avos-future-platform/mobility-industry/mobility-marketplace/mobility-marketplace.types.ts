export type MobilityMarketplaceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MobilityMarketplaceCapability {
  id: string;
  name: string;
  group: string;
  status: MobilityMarketplaceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}