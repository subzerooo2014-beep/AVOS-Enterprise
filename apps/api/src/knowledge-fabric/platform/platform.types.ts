export type KnowledgeIntelligencePlatformState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeIntelligencePlatformRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeIntelligencePlatformState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeIntelligencePlatformStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-19 Knowledge Intelligence Platform";
  status: "operational";
  capabilities: string[];
  records: number;
}