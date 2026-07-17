export type RegionalizationEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RegionalizationEngineCapability {
  id: string;
  name: string;
  group: string;
  status: RegionalizationEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}