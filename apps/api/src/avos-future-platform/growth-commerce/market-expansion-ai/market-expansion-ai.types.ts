export type MarketExpansionAiStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MarketExpansionAiCapability {
  id: string;
  name: string;
  group: string;
  status: MarketExpansionAiStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}