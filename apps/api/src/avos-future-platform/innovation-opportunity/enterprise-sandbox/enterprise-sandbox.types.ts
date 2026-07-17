export type EnterpriseSandboxStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface EnterpriseSandboxCapability {
  id: string;
  name: string;
  group: string;
  status: EnterpriseSandboxStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}