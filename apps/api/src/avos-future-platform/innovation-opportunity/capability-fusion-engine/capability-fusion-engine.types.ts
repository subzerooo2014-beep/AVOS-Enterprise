export type CapabilityFusionEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CapabilityFusionEngineCapability {
  id: string;
  name: string;
  group: string;
  status: CapabilityFusionEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}