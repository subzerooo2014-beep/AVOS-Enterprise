export type SystemCertifierStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SystemCertifierCapability {
  id: string;
  name: string;
  group: string;
  status: SystemCertifierStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}