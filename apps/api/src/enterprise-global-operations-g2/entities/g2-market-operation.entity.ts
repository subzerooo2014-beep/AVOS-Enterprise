export interface G2MarketOperation {
  id: string;
  marketCode: string;
  operationType: string;
  status: string;
  riskScore?: number;
  metadata?: Record<string, unknown>;
}