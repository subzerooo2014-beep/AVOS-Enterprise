export type KnowledgeSecurityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeSecurityRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeSecurityState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSecurityStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-14 Knowledge Security";
  status: "operational";
  capabilities: string[];
  records: number;
}