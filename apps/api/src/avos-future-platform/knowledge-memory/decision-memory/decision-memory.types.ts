export type DecisionMemoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DecisionMemoryCapability {
  id: string;
  name: string;
  group: string;
  status: DecisionMemoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}