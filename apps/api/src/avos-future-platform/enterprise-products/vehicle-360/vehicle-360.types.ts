export type Vehicle360Status = 'planned' | 'active' | 'degraded' | 'disabled';

export interface Vehicle360Capability {
  id: string;
  name: string;
  group: string;
  status: Vehicle360Status;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}