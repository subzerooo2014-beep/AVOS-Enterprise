export type ControllerGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ControllerGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: ControllerGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}