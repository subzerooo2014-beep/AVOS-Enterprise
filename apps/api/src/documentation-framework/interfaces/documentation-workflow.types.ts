import { AvosDocumentStatus } from "../interfaces/documentation.types";

export type DocumentationReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type DocumentationAuditAction =
  | "version-created"
  | "review-requested"
  | "review-approved"
  | "review-rejected"
  | "status-transitioned"
  | "certified"
  | "certification-revoked";

export interface DocumentationVersionRecord {
  id: string;
  documentId: string;
  version: string;
  previousVersion?: string;
  changeSummary: string;
  changeType: "patch" | "minor" | "major";
  createdBy: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface DocumentationReviewRecord {
  id: string;
  documentId: string;
  version: string;
  requestedBy: string;
  requestedAt: string;
  status: DocumentationReviewStatus;
  reviewer?: string;
  decisionReason?: string;
  decidedAt?: string;
  humanFinalAuthorityRequired: boolean;
}

export interface DocumentationAuditRecord {
  id: string;
  documentId: string;
  action: DocumentationAuditAction;
  actor: string;
  occurredAt: string;
  previousStatus?: AvosDocumentStatus;
  nextStatus?: AvosDocumentStatus;
  referenceId?: string;
  details: Record<string, unknown>;
}

export interface DocumentationCertificationRecord {
  id: string;
  documentId: string;
  version: string;
  status: "certified" | "revoked";
  score: number;
  certifiedBy: string;
  certifiedAt: string;
  revokedAt?: string;
  checks: Record<string, boolean>;
  notes?: string;
}
