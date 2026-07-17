export type PricingIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PricingIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: PricingIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}