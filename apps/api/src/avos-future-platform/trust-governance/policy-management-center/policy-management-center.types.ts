export type PolicyManagementCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PolicyManagementCenterCapability {
  id: string;
  name: string;
  group: string;
  status: PolicyManagementCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}