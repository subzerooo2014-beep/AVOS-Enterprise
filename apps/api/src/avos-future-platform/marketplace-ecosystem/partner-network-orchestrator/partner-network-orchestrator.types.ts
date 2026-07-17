export type PartnerNetworkOrchestratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PartnerNetworkOrchestratorCapability {
  id: string;
  name: string;
  group: string;
  status: PartnerNetworkOrchestratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}