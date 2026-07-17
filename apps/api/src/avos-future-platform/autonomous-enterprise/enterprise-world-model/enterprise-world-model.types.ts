export type EnterpriseWorldModelStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseWorldModelCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseWorldModelStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}