export type FinancePlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface FinancePlatformCapability {
  id: string;
  name: string;
  group: string;
  status: FinancePlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}