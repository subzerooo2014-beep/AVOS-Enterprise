export type KnowledgeCertificationStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface KnowledgeCertificationCapability {
  id: string;
  name: string;
  group: string;
  status: KnowledgeCertificationStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}