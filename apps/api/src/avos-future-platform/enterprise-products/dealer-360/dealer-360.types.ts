export type Dealer360Status = 'planned' | 'active' | 'degraded' | 'disabled';

export interface Dealer360Capability {
  id: string;
  name: string;
  group: string;
  status: Dealer360Status;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}