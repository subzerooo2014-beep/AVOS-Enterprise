export type ProcurementPlatformStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ProcurementPlatformCapability {
  id: string;
  name: string;
  group: string;
  status: ProcurementPlatformStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}