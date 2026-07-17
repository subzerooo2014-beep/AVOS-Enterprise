export type LicenseManagementStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LicenseManagementCapability {
  id: string;
  name: string;
  group: string;
  status: LicenseManagementStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}