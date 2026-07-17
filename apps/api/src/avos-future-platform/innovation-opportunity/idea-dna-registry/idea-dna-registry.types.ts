export type IdeaDnaRegistryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface IdeaDnaRegistryCapability {
  id: string;
  name: string;
  group: string;
  status: IdeaDnaRegistryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}