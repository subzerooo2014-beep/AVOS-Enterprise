export type BlueprintMarketplaceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface BlueprintMarketplaceCapability {
  id: string;
  name: string;
  group: string;
  status: BlueprintMarketplaceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}