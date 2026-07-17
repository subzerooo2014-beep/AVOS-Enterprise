export type EnterpriseAppStoreStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseAppStoreCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseAppStoreStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}