export type StrategicPlanningEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface StrategicPlanningEngineCapability {
  id: string;
  name: string;
  group: string;
  status: StrategicPlanningEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}