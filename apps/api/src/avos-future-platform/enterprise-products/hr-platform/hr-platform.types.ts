export type HrPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface HrPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: HrPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}