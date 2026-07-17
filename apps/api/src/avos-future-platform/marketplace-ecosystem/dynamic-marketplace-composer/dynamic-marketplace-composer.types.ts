export type DynamicMarketplaceComposerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DynamicMarketplaceComposerCapability {
  id: string;
  name: string;
  group: string;
  status: DynamicMarketplaceComposerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}