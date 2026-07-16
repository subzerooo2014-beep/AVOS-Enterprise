export interface FactoryV2Metric {
  id: string;
  metric: string;
  value: number;
  recordedAt: string;
  tags?: Record<string, unknown>;
}