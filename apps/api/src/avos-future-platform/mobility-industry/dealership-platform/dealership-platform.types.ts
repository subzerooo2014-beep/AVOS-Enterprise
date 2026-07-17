export type DealershipPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DealershipPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: DealershipPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}