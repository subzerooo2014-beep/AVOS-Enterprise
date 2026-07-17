export type EnterpriseDigitalMemoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseDigitalMemoryCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseDigitalMemoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}