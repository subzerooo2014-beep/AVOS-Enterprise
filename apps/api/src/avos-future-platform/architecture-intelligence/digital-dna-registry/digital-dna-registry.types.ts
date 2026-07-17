export type DigitalDnaRegistryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DigitalDnaRegistryCapability {
  id: string;
  name: string;
  group: string;
  status: DigitalDnaRegistryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}