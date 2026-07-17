export type SemanticIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SemanticIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: SemanticIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}