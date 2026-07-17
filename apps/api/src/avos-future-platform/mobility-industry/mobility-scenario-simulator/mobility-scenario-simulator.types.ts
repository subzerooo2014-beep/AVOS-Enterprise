export type MobilityScenarioSimulatorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface MobilityScenarioSimulatorCapability {
  id: string;
  name: string;
  group: string;
  status: MobilityScenarioSimulatorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}