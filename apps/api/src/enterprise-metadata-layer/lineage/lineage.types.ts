export type MetadataLineageState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataLineageRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataLineageState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataLineageStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Lineage";
  status: "operational";
  capabilities: string[];
  records: number;
}