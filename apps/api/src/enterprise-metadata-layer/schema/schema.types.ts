export type MetadataSchemaState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataSchemaRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataSchemaState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataSchemaStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Schema";
  status: "operational";
  capabilities: string[];
  records: number;
}