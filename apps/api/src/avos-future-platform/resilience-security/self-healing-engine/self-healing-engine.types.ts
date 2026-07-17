export type SelfHealingEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SelfHealingEngineCapability {
  id: string;
  name: string;
  group: string;
  status: SelfHealingEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}