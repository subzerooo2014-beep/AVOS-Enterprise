export interface G10ExecutiveDecision {
  id: string;
  decisionType: string;
  priority: number;
  approved: boolean;
  context?: Record<string, unknown>;
}