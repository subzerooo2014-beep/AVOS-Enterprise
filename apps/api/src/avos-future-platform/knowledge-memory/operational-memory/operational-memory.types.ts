export type OperationalMemoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface OperationalMemoryCapability {
  id: string;
  name: string;
  group: string;
  status: OperationalMemoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}