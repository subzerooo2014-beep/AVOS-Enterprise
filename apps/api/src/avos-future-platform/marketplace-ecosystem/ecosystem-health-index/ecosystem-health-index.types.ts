export type EcosystemHealthIndexStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EcosystemHealthIndexCapability {
  id: string;
  name: string;
  group: string;
  status: EcosystemHealthIndexStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}