export type PrescriptiveAnalyticsStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PrescriptiveAnalyticsCapability {
  id: string;
  name: string;
  group: string;
  status: PrescriptiveAnalyticsStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}