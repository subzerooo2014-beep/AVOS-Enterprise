export type MetadataCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataCertificationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataCertificationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataCertificationStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Certification";
  status: "operational";
  capabilities: string[];
  records: number;
}