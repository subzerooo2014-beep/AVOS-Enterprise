export type InnovationGenomeStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InnovationGenomeCapability {
  id: string;
  name: string;
  group: string;
  status: InnovationGenomeStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}