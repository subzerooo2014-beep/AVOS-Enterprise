export type AutonomousExpansionEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AutonomousExpansionEngineCapability {
  id: string;
  name: string;
  group: string;
  status: AutonomousExpansionEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}