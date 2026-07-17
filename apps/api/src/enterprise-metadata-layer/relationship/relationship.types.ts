export type MetadataRelationshipState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataRelationshipRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataRelationshipState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataRelationshipStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Relationship Graph";
  status: "operational";
  capabilities: string[];
  records: number;
}