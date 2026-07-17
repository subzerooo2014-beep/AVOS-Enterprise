export type GenesisEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GenesisEngineCapability {
  id: string;
  name: string;
  group: string;
  status: GenesisEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}