export type CompetitorIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CompetitorIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: CompetitorIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}