export type ArchitectureEvolutionAnalyzerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ArchitectureEvolutionAnalyzerCapability {
  id: string;
  name: string;
  group: string;
  status: ArchitectureEvolutionAnalyzerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}