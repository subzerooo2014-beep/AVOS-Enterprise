export type VehicleIntelligencePlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface VehicleIntelligencePlatformCapability {
  id: string;
  name: string;
  group: string;
  status: VehicleIntelligencePlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}