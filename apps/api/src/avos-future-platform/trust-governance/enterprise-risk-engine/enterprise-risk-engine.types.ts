export type EnterpriseRiskEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseRiskEngineCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseRiskEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}