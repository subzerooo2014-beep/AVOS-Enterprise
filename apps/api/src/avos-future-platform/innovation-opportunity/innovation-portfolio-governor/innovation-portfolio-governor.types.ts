export type InnovationPortfolioGovernorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface InnovationPortfolioGovernorCapability {
  id: string;
  name: string;
  group: string;
  status: InnovationPortfolioGovernorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}