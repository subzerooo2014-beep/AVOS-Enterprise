export type EnterpriseBrainStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseBrainCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseBrainStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}