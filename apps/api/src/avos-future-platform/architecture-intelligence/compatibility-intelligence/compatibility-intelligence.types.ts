export type CompatibilityIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CompatibilityIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: CompatibilityIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}