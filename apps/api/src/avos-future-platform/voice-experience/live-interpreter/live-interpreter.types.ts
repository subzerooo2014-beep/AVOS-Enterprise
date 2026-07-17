export type LiveInterpreterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LiveInterpreterCapability {
  id: string;
  name: string;
  group: string;
  status: LiveInterpreterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}