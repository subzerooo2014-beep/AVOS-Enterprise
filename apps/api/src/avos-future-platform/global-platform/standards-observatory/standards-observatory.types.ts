export type StandardsObservatoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface StandardsObservatoryCapability {
  id: string;
  name: string;
  group: string;
  status: StandardsObservatoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}