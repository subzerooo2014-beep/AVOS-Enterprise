export type MetadataGovernanceState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface MetadataGovernanceRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: MetadataGovernanceState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataGovernanceStatus {
  system: "AVOS Enterprise Metadata Layer";
  layer: "Metadata Governance";
  status: "operational";
  capabilities: string[];
  records: number;
}