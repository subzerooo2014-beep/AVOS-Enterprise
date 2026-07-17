export type CustomerJourneyGenomeStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CustomerJourneyGenomeCapability {
  id: string;
  name: string;
  group: string;
  status: CustomerJourneyGenomeStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}