export type CapabilityMarketplaceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CapabilityMarketplaceCapability {
  id: string;
  name: string;
  group: string;
  status: CapabilityMarketplaceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}