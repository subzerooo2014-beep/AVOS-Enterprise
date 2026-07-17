export type DigitalGenomeRegistryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DigitalGenomeRegistryCapability {
  id: string;
  name: string;
  group: string;
  status: DigitalGenomeRegistryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}