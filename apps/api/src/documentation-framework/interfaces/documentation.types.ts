export type AvosDocumentStatus =
  | "draft"
  | "under-review"
  | "approved"
  | "active"
  | "deprecated"
  | "superseded";

export type AvosDocumentCategory =
  | "constitution"
  | "law"
  | "standard"
  | "governance"
  | "architecture"
  | "foundation"
  | "security"
  | "compliance"
  | "technical"
  | "product"
  | "other";

export interface AvosDocumentRecord {
  id: string;
  title: string;
  version: string;
  status: AvosDocumentStatus;
  category: AvosDocumentCategory;
  classification: string;
  authority: string;
  owner: string;
  approver?: string;
  appliesTo: string[];
  dependsOn: string[];
  relatedDocuments: string[];
  filePath?: string;
  checksum?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  metadata: Record<string, unknown>;
}

export interface AvosDocumentationMetrics {
  totalDocuments: number;
  activeDocuments: number;
  approvedDocuments: number;
  draftDocuments: number;
  categories: Record<string, number>;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
}
