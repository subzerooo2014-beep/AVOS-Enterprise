import { AgsActionRiskLevel } from "../execution-core/adaptive-growth-execution.contracts";

export type AgsApprovalStatus =
  | "pending"
  | "assigned"
  | "under-review"
  | "waiting-evidence"
  | "approved"
  | "rejected"
  | "returned"
  | "expired";

export type AgsDecisionType =
  | "approve"
  | "reject"
  | "return"
  | "request-evidence";

export interface AgsApprovalPolicy {
  key: string;
  riskLevel: AgsActionRiskLevel;
  requiredAuthority: string;
  minimumEvidenceItems: number;
  requiresReason: boolean;
  requiresSignature: boolean;
  expiresAfterHours: number;
  enabled: boolean;
}

export interface AgsApprovalRequest {
  id: string;
  actionId: string;
  policyKey: string;
  status: AgsApprovalStatus;
  priority: number;
  requestedBy: string;
  assignedTo?: string;
  riskLevel: AgsActionRiskLevel;
  requiredAuthority: string;
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface AgsDecisionEvidence {
  id: string;
  approvalId: string;
  actionId: string;
  source: string;
  type: string;
  title: string;
  summary: string;
  payload: Record<string, unknown>;
  confidence: number;
  collectedAt: string;
}

export interface AgsHumanDecisionInput {
  approvalId: string;
  decision: AgsDecisionType;
  approverId: string;
  authority: string;
  reason: string;
  notes?: string;
  evidenceIds?: string[];
}

export interface AgsDecisionRecord {
  id: string;
  approvalId: string;
  actionId: string;
  decision: AgsDecisionType;
  approverId: string;
  authority: string;
  reason: string;
  notes?: string;
  riskLevel: AgsActionRiskLevel;
  policyKey: string;
  evidenceIds: string[];
  decisionHash: string;
  signature: string;
  signatureAlgorithm: string;
  version: string;
  createdAt: string;
}

export interface AgsDecisionAuditEntry {
  id: string;
  decisionId?: string;
  approvalId: string;
  actionId: string;
  event: string;
  actor: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface AgsDecisionExplanation {
  approvalId: string;
  actionId: string;
  whyThisAction: string;
  expectedImpact: string;
  risks: string[];
  alternatives: string[];
  confidence: number;
  requiredApproval: string;
  humanFinalAuthority: true;
}