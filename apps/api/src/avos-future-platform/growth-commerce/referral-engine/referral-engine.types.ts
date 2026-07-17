export type ReferralEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ReferralEngineCapability {
  id: string;
  name: string;
  group: string;
  status: ReferralEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}