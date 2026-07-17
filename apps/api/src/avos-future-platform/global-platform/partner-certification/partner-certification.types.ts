export type PartnerCertificationStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface PartnerCertificationCapability {
  id: string;
  name: string;
  group: string;
  status: PartnerCertificationStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}