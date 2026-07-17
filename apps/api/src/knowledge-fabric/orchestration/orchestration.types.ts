export type KnowledgeOrchestrationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeOrchestrationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeOrchestrationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeOrchestrationStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-18 Knowledge Orchestration";
  status: "operational";
  capabilities: string[];
  records: number;
}