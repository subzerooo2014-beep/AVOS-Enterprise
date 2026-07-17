export type EnterpriseImmuneSystemStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseImmuneSystemCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseImmuneSystemStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}