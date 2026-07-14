export type DataAssetStatus = "ACTIVE" | "DEPRECATED" | "ARCHIVED";

export interface DataAssetRecord {
  id: string;
  name: string;
  type: string;
  source: string;
  status: DataAssetStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsMetricRecord {
  id: string;
  name: string;
  value: number;
  unit: string;
  dimensions: Record<string, string>;
  recordedAt: string;
}
