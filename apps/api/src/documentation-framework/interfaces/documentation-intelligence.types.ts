export type DocumentationHealthLevel = "excellent" | "healthy" | "attention" | "critical";
export type BlueprintSyncStatus = "synchronized" | "drift-detected" | "not-linked";
export type DocumentationRecommendationPriority = "low" | "medium" | "high" | "critical";

export interface DocumentationIntelligenceReport {
  id: string;
  documentId: string;
  score: number;
  level: DocumentationHealthLevel;
  completenessScore: number;
  governanceScore: number;
  linkageScore: number;
  freshnessScore: number;
  findings: string[];
  recommendations: DocumentationRecommendation[];
  analyzedAt: string;
}

export interface DocumentationRecommendation {
  id: string;
  documentId: string;
  priority: DocumentationRecommendationPriority;
  category: "completeness" | "governance" | "linkage" | "freshness" | "blueprint";
  message: string;
  humanApprovalRequired: boolean;
  createdAt: string;
}

export interface BlueprintBindingRecord {
  id: string;
  documentId: string;
  blueprintId: string;
  blueprintVersion: string;
  documentVersion: string;
  checksum?: string;
  linkedBy: string;
  linkedAt: string;
  lastSynchronizedAt?: string;
  status: BlueprintSyncStatus;
}

export interface LivingDocumentationSnapshot {
  id: string;
  documentId: string;
  documentVersion: string;
  blueprintId?: string;
  blueprintVersion?: string;
  syncStatus: BlueprintSyncStatus;
  driftReasons: string[];
  generatedBy: string;
  generatedAt: string;
  humanFinalAuthority: true;
}
