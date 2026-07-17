export type InfluencerHubStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InfluencerHubCapability {
  id: string;
  name: string;
  group: string;
  status: InfluencerHubStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}