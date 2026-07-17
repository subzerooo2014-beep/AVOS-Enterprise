export type IncidentLearningEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface IncidentLearningEngineCapability {
  id: string;
  name: string;
  group: string;
  status: IncidentLearningEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}