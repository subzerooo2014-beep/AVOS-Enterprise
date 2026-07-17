export type TenantProvisioningStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface TenantProvisioningCapability {
  id: string;
  name: string;
  group: string;
  status: TenantProvisioningStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}