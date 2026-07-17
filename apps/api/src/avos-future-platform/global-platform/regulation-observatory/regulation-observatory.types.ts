export type RegulationObservatoryStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RegulationObservatoryCapability {
  id: string;
  name: string;
  group: string;
  status: RegulationObservatoryStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}