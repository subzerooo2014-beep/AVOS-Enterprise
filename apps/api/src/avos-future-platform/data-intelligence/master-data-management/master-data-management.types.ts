export type MasterDataManagementStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MasterDataManagementCapability {
  id: string;
  name: string;
  group: string;
  status: MasterDataManagementStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}