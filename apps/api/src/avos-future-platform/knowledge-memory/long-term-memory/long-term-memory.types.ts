export type LongTermMemoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface LongTermMemoryCapability {
  id: string;
  name: string;
  group: string;
  status: LongTermMemoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}