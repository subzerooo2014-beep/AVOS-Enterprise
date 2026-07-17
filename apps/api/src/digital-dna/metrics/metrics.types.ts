export type DigitalDnaMetricsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaMetricsRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaMetricsState;
  version: string;
  attributes: Record<string, unknown>;
  relations: string[];
  policies: string[];
  permissions: string[];
  events: string[];
  metrics: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalDnaMetricsStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aM et ri cs";
  status: "operational";
  capabilities: string[];
  records: number;
}