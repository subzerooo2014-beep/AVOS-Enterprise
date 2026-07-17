export type ContinuousOptimizationEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ContinuousOptimizationEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ContinuousOptimizationEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}