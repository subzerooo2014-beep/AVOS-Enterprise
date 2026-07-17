export type WorkshopPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface WorkshopPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: WorkshopPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}