export type HumanApprovalFrameworkStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface HumanApprovalFrameworkCapability {
  id: string;
  name: string;
  group: string;
  status: HumanApprovalFrameworkStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}