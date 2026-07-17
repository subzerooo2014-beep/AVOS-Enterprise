export type ServiceGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ServiceGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: ServiceGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}