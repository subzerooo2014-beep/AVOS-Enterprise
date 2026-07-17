export type KnowledgeFabricCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface KnowledgeFabricCertificationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: KnowledgeFabricCertificationState;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeFabricCertificationStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-20 Knowledge Fabric Certification";
  status: "operational";
  capabilities: string[];
  records: number;
}