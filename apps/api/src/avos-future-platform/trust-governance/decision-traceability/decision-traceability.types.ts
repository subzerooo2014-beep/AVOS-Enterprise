export type DecisionTraceabilityStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DecisionTraceabilityCapability {
  id: string;
  name: string;
  group: string;
  status: DecisionTraceabilityStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}