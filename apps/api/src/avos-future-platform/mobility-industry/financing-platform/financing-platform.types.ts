export type FinancingPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface FinancingPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: FinancingPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}