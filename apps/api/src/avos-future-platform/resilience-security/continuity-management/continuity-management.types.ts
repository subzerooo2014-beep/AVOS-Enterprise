export type ContinuityManagementStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface ContinuityManagementCapability {
  id: string;
  name: string;
  group: string;
  status: ContinuityManagementStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}