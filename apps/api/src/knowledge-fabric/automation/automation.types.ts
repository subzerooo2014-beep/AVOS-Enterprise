export type KnowledgeAutomationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeAutomationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeAutomationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeAutomationStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-17 Knowledge Automation";
  status: "operational";
  capabilities: string[];
  records: number;
}