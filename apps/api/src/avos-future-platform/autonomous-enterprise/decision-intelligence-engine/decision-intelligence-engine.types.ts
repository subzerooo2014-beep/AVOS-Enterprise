export type DecisionIntelligenceEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DecisionIntelligenceEngineCapability {
  id: string;
  name: string;
  group: string;
  status: DecisionIntelligenceEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}