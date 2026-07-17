export type ModuleGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ModuleGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: ModuleGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}