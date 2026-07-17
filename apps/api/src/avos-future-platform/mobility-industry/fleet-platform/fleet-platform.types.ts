export type FleetPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface FleetPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: FleetPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}