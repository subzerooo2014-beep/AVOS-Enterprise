export type GrowthAiStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GrowthAiCapability {
  id: string;
  name: string;
  group: string;
  status: GrowthAiStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}