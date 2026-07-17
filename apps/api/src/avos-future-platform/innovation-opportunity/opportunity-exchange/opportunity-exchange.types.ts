export type OpportunityExchangeStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface OpportunityExchangeCapability {
  id: string;
  name: string;
  group: string;
  status: OpportunityExchangeStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}