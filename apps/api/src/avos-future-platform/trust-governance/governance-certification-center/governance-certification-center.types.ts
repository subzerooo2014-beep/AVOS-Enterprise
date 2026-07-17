export type GovernanceCertificationCenterStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GovernanceCertificationCenterCapability {
  id: string;
  name: string;
  group: string;
  status: GovernanceCertificationCenterStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}