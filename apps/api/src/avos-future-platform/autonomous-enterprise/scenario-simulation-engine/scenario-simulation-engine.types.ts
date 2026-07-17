export type ScenarioSimulationEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ScenarioSimulationEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ScenarioSimulationEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}