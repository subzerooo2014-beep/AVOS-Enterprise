export interface G3RevenueExperiment {
  id: string;
  name: string;
  status: string;
  uplift?: number;
  configuration?: Record<string, unknown>;
}