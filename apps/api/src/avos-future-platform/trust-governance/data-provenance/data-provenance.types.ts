export type DataProvenanceStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DataProvenanceCapability {
  id: string;
  name: string;
  group: string;
  status: DataProvenanceStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}