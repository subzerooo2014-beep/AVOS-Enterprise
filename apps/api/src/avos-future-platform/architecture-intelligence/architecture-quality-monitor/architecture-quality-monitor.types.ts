export type ArchitectureQualityMonitorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ArchitectureQualityMonitorCapability {
  id: string;
  name: string;
  group: string;
  status: ArchitectureQualityMonitorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}