export type ResilienceSimulatorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ResilienceSimulatorCapability {
  id: string;
  name: string;
  group: string;
  status: ResilienceSimulatorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}