export type CrmPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CrmPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: CrmPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}