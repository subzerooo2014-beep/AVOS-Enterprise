export type UpgradeIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface UpgradeIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: UpgradeIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}