export type ArchitectureIntelligenceEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ArchitectureIntelligenceEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ArchitectureIntelligenceEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}