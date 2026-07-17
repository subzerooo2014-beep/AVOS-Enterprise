export type ValueCreationEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ValueCreationEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ValueCreationEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}