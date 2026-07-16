export interface G6RecoveryPlan {
  id: string;
  planCode: string;
  priority: number;
  approved: boolean;
  steps?: Record<string, unknown>;
}