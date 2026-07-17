export type PredictiveAnalyticsStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PredictiveAnalyticsCapability {
  id: string;
  name: string;
  group: string;
  status: PredictiveAnalyticsStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}