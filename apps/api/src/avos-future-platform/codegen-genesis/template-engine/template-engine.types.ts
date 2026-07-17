export type TemplateEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface TemplateEngineCapability {
  id: string;
  name: string;
  group: string;
  status: TemplateEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}