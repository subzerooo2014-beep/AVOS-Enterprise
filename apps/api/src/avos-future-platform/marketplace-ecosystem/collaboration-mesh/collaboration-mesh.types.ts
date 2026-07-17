export type CollaborationMeshStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CollaborationMeshCapability {
  id: string;
  name: string;
  group: string;
  status: CollaborationMeshStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}