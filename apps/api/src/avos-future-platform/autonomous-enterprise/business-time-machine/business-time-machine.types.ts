export type BusinessTimeMachineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface BusinessTimeMachineCapability {
  id: string;
  name: string;
  group: string;
  status: BusinessTimeMachineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}