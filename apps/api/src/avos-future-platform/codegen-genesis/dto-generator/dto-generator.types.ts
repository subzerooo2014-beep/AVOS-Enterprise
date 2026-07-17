export type DtoGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DtoGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: DtoGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}