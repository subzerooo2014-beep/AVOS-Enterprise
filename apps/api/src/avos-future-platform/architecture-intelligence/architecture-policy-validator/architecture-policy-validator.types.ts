export type ArchitecturePolicyValidatorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ArchitecturePolicyValidatorCapability {
  id: string;
  name: string;
  group: string;
  status: ArchitecturePolicyValidatorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}