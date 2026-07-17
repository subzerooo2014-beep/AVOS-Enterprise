export type MetadataRegistryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataRegistryRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataRegistryState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataRegistryStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Registry";
  status: "operational";
  capabilities: string[];
  records: number;
}