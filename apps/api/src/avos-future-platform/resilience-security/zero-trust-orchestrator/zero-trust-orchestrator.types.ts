export type ZeroTrustOrchestratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ZeroTrustOrchestratorCapability {
  id: string;
  name: string;
  group: string;
  status: ZeroTrustOrchestratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}