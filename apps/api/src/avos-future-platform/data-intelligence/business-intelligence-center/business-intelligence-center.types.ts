export type BusinessIntelligenceCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface BusinessIntelligenceCenterCapability {
  id: string;
  name: string;
  group: string;
  status: BusinessIntelligenceCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}