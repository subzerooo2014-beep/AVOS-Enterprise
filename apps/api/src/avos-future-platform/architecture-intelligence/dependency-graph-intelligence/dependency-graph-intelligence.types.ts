export type DependencyGraphIntelligenceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DependencyGraphIntelligenceCapability {
  id: string;
  name: string;
  group: string;
  status: DependencyGraphIntelligenceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}