export type ViralEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ViralEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ViralEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}