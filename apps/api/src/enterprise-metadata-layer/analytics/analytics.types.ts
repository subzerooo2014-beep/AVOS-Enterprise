export type MetadataAnalyticsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataAnalyticsRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataAnalyticsState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataAnalyticsStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Analytics";
  status: "operational";
  capabilities: string[];
  records: number;
}