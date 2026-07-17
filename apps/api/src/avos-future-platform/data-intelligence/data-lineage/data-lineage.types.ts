export type DataLineageStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DataLineageCapability {
  id: string;
  name: string;
  group: string;
  status: DataLineageStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}