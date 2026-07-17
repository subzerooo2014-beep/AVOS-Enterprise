export type RecoveryPlannerStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface RecoveryPlannerCapability {
  id: string;
  name: string;
  group: string;
  status: RecoveryPlannerStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}