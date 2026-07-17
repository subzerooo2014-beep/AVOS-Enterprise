export type ExecutiveCockpitStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ExecutiveCockpitCapability {
  id: string;
  name: string;
  group: string;
  status: ExecutiveCockpitStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}