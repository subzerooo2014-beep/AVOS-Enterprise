export type SpatialVoiceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SpatialVoiceCapability {
  id: string;
  name: string;
  group: string;
  status: SpatialVoiceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}