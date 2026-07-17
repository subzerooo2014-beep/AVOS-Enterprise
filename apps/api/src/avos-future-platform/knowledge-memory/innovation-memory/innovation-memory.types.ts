export type InnovationMemoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InnovationMemoryCapability {
  id: string;
  name: string;
  group: string;
  status: InnovationMemoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}