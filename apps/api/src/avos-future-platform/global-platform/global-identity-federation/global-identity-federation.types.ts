export type GlobalIdentityFederationStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GlobalIdentityFederationCapability {
  id: string;
  name: string;
  group: string;
  status: GlobalIdentityFederationStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}