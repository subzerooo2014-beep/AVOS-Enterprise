export interface G6RiskSignal {
  id: string;
  riskType: string;
  severity: number;
  active: boolean;
  metadata?: Record<string, unknown>;
}