export interface G5CapitalDecision {
  id: string;
  decisionType: string;
  amount: number;
  status: string;
  rationale?: Record<string, unknown>;
}