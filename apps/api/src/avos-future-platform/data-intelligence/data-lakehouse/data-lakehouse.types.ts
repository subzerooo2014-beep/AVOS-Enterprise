export type DataLakehouseStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DataLakehouseCapability {
  id: string;
  name: string;
  group: string;
  status: DataLakehouseStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}