export type InsurancePlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InsurancePlatformCapability {
  id: string;
  name: string;
  group: string;
  status: InsurancePlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}