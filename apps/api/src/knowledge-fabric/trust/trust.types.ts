export type KnowledgeTrustState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeTrustRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeTrustState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeTrustStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-13 Knowledge Trust";
  status: "operational";
  capabilities: string[];
  records: number;
}