export type ErpPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ErpPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: ErpPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}