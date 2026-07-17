export type RealTimeInsightEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RealTimeInsightEngineCapability {
  id: string;
  name: string;
  group: string;
  status: RealTimeInsightEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}