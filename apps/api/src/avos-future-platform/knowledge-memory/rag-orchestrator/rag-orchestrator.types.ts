export type RagOrchestratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RagOrchestratorCapability {
  id: string;
  name: string;
  group: string;
  status: RagOrchestratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}