export type KnowledgeComplianceState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeComplianceRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeComplianceState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeComplianceStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-15 Knowledge Compliance";
  status: "operational";
  capabilities: string[];
  records: number;
}