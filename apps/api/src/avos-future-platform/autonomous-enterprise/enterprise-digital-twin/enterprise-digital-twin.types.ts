export type EnterpriseDigitalTwinStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseDigitalTwinCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseDigitalTwinStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}