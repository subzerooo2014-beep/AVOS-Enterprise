export type MultiTenantControlPlaneStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MultiTenantControlPlaneCapability {
  id: string;
  name: string;
  group: string;
  status: MultiTenantControlPlaneStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}