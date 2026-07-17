export type RollbackIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RollbackIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: RollbackIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}