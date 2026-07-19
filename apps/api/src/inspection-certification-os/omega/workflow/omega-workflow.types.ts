export type CertificationWorkflowState =
  | "draft"
  | "inspection-pending"
  | "inspection-completed"
  | "remediation-required"
  | "remediation-in-progress"
  | "verification-pending"
  | "approval-pending"
  | "approved"
  | "rejected"
  | "certified"
  | "suspended"
  | "expired"
  | "revoked";

export type ApprovalDecision =
  | "pending"
  | "approved"
  | "rejected"
  | "changes-requested";

export interface CertificationWorkflow {
  readonly workflowId: string;
  readonly subjectId: string;
  readonly subjectType: string;
  readonly state: CertificationWorkflowState;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
  readonly history: readonly WorkflowTransition[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface WorkflowTransition {
  readonly transitionId: string;
  readonly from: CertificationWorkflowState;
  readonly to: CertificationWorkflowState;
  readonly actor: string;
  readonly reason: string;
  readonly createdAt: string;
  readonly humanApproved: boolean;
}

export interface ApprovalRequest {
  readonly approvalId: string;
  readonly workflowId: string;
  readonly requestedBy: string;
  readonly requestedAt: string;
  readonly decision: ApprovalDecision;
  readonly decidedBy?: string;
  readonly decidedAt?: string;
  readonly reason?: string;
  readonly humanFinalAuthority: true;
}

export interface LifecycleRecord {
  readonly lifecycleId: string;
  readonly workflowId: string;
  readonly state: CertificationWorkflowState;
  readonly effectiveAt: string;
  readonly expiresAt?: string;
  readonly suspensionReason?: string;
  readonly revocationReason?: string;
}

export interface WorkflowAssignment {
  readonly assignmentId: string;
  readonly workflowId: string;
  readonly assignee: string;
  readonly role: "inspector" | "reviewer" | "approver" | "owner";
  readonly assignedAt: string;
  readonly status: "active" | "completed" | "revoked";
}
