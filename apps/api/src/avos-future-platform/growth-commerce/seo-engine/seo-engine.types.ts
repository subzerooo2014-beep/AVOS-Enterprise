export type SeoEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SeoEngineCapability {
  id: string;
  name: string;
  group: string;
  status: SeoEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}