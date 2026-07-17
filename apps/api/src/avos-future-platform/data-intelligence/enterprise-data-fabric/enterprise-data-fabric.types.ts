export type EnterpriseDataFabricStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseDataFabricCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseDataFabricStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}