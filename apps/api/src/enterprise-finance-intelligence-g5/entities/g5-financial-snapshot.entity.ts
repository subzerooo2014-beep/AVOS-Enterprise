export interface G5FinancialSnapshot {
  id: string;
  period: string;
  revenue: number;
  cost: number;
  metadata?: Record<string, unknown>;
}