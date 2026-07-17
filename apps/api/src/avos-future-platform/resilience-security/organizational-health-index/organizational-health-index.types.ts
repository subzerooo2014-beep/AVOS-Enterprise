export type OrganizationalHealthIndexStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface OrganizationalHealthIndexCapability {
  id: string;
  name: string;
  group: string;
  status: OrganizationalHealthIndexStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}