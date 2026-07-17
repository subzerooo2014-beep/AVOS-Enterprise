export type DelegationAuthorityEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DelegationAuthorityEngineCapability {
  id: string;
  name: string;
  group: string;
  status: DelegationAuthorityEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}