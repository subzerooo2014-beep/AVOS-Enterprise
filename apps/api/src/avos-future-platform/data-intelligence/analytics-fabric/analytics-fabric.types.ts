export type AnalyticsFabricStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AnalyticsFabricCapability {
  id: string;
  name: string;
  group: string;
  status: AnalyticsFabricStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}