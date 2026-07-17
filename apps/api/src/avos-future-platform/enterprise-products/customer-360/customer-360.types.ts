export type Customer360Status = 'planned' | 'active' | 'degraded' | 'disabled';

export interface Customer360Capability {
  id: string;
  name: string;
  group: string;
  status: Customer360Status;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}