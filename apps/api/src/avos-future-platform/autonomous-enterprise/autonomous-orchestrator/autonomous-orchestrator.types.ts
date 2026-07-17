export type AutonomousOrchestratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AutonomousOrchestratorCapability {
  id: string;
  name: string;
  group: string;
  status: AutonomousOrchestratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}