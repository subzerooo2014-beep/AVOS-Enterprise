export type KnowledgeCapitalState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeCapitalRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeCapitalState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeCapitalStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-12 Knowledge Capital";
  status: "operational";
  capabilities: string[];
  records: number;
}