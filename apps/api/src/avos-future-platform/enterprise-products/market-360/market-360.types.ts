export type Market360Status = 'planned' | 'active' | 'degraded' | 'disabled';

export interface Market360Capability {
  id: string;
  name: string;
  group: string;
  status: Market360Status;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}