export type GrowthBrainStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GrowthBrainCapability {
  id: string;
  name: string;
  group: string;
  status: GrowthBrainStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}