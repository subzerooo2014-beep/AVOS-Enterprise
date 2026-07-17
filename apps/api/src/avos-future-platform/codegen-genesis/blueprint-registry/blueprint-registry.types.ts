export type BlueprintRegistryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface BlueprintRegistryCapability {
  id: string;
  name: string;
  group: string;
  status: BlueprintRegistryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}