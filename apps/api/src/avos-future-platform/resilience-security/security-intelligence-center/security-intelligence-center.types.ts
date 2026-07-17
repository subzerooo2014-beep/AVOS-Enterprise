export type SecurityIntelligenceCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SecurityIntelligenceCenterCapability {
  id: string;
  name: string;
  group: string;
  status: SecurityIntelligenceCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}