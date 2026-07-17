export type DataGovernanceCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DataGovernanceCenterCapability {
  id: string;
  name: string;
  group: string;
  status: DataGovernanceCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}