export type RemediationSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RemediationStatus =
  | "open"
  | "planned"
  | "in-progress"
  | "blocked"
  | "resolved"
  | "verified"
  | "closed";

export interface RemediationFinding {
  readonly findingId: string;
  readonly source: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly severity: RemediationSeverity;
  readonly detectedAt: string;
  readonly evidenceIds: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface RemediationIssue {
  readonly issueId: string;
  readonly findingId: string;
  readonly title: string;
  readonly severity: RemediationSeverity;
  readonly riskScore: number;
  readonly status: RemediationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner?: string;
  readonly dueAt?: string;
  readonly tags: readonly string[];
}

export interface RemediationRecommendation {
  readonly recommendationId: string;
  readonly issueId: string;
  readonly priority: number;
  readonly title: string;
  readonly rationale: readonly string[];
  readonly actions: readonly string[];
  readonly automationCandidate: boolean;
  readonly requiresHumanApproval: true;
}

export interface RemediationAction {
  readonly actionId: string;
  readonly issueId: string;
  readonly title: string;
  readonly sequence: number;
  readonly status:
    | "pending"
    | "approved"
    | "executing"
    | "completed"
    | "failed"
    | "skipped";
  readonly executable: boolean;
  readonly destructive: false;
  readonly requiresHumanApproval: true;
}

export interface RemediationPlan {
  readonly planId: string;
  readonly createdAt: string;
  readonly issueIds: readonly string[];
  readonly recommendations: readonly RemediationRecommendation[];
  readonly actions: readonly RemediationAction[];
  readonly totalRisk: number;
  readonly readinessScore: number;
  readonly governance: {
    readonly humanFinalAuthority: true;
    readonly autonomousFinalApproval: false;
    readonly destructiveAutoFix: false;
    readonly evidenceRequired: true;
  };
}
