export type GovernanceDecisionStatus =
  | "pending-human-approval"
  | "approved"
  | "rejected"
  | "remediation-required";

export interface GovernanceEvidence {
  readonly evidenceId: string;
  readonly source: string;
  readonly category: string;
  readonly capturedAt: string;
  readonly checksum: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface GovernanceDecision {
  readonly decisionId: string;
  readonly subjectId: string;
  readonly status: GovernanceDecisionStatus;
  readonly rationale: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly decidedAt: string;
  readonly decidedBy: string;
  readonly humanFinalAuthority: true;
}

export interface GovernanceAssessment {
  readonly assessmentId: string;
  readonly generatedAt: string;
  readonly version: string;
  readonly scores: {
    readonly compliance: number;
    readonly trust: number;
    readonly explainability: number;
    readonly traceability: number;
    readonly provenance: number;
  };
  readonly policyResults: readonly {
    readonly policyId: string;
    readonly compliant: boolean;
    readonly failures: readonly string[];
  }[];
  readonly evidence: readonly GovernanceEvidence[];
  readonly decision: GovernanceDecision;
  readonly approvalRequest: {
    readonly requestId: string;
    readonly status: "pending";
  };
  readonly governance: {
    readonly humanFinalAuthority: true;
    readonly autonomousFinalApproval: false;
    readonly immutableAuditIntent: true;
    readonly nonDestructive: true;
  };
}
