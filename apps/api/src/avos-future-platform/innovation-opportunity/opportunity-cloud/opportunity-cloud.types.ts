export type OpportunityCloudStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface OpportunityCloudCapability {
  id: string;
  name: string;
  group: string;
  status: OpportunityCloudStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}