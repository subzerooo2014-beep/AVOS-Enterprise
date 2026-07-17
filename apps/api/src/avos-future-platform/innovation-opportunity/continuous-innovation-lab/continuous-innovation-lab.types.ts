export type ContinuousInnovationLabStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ContinuousInnovationLabCapability {
  id: string;
  name: string;
  group: string;
  status: ContinuousInnovationLabStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}