export type KnowledgeAnalyticsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeAnalyticsRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeAnalyticsState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeAnalyticsStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-16 Knowledge Analytics";
  status: "operational";
  capabilities: string[];
  records: number;
}