export type MetadataAiState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataAiRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataAiState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataAiStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Automation";
  status: "operational";
  capabilities: string[];
  records: number;
}