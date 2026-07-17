export type NetworkEffectEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface NetworkEffectEngineCapability {
  id: string;
  name: string;
  group: string;
  status: NetworkEffectEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}