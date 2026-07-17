export type RevenueOptimizerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RevenueOptimizerCapability {
  id: string;
  name: string;
  group: string;
  status: RevenueOptimizerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}