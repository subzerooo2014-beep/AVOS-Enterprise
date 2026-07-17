export type ApiExchangeStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ApiExchangeCapability {
  id: string;
  name: string;
  group: string;
  status: ApiExchangeStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}