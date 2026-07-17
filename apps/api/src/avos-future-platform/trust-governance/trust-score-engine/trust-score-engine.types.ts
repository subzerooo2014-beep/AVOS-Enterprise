export type TrustScoreEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface TrustScoreEngineCapability {
  id: string;
  name: string;
  group: string;
  status: TrustScoreEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}