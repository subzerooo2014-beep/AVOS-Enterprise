export type MetadataCatalogState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataCatalogRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataCatalogState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataCatalogStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Catalog";
  status: "operational";
  capabilities: string[];
  records: number;
}