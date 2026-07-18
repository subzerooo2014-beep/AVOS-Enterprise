export type FailureCategory =
  | "typescript"
  | "dependency"
  | "runtime"
  | "filesystem"
  | "configuration"
  | "validation"
  | "security"
  | "unknown";

export type FailureSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface FailureDiagnosisRequest {
  message: string;
  stack?: string;
  command?: string;
  exitCode?: number;
  workspacePath?: string;
  approvedBy: string;
  metadata?: Record<string, unknown>;
}

export interface FailureEvidence {
  type: string;
  value: string;
  confidence: number;
}

export interface FailureRootCause {
  category: FailureCategory;
  summary: string;
  confidence: number;
  evidence: FailureEvidence[];
}

export interface FailureSuggestedFix {
  title: string;
  description: string;
  commands: string[];
  risk: FailureSeverity;
  requiresHumanApproval: boolean;
}

export interface FailureRecoveryStep {
  order: number;
  title: string;
  action: string;
  verification: string;
  requiresHumanApproval: boolean;
}

export interface FailureDiagnosisResult {
  id: string;
  category: FailureCategory;
  severity: FailureSeverity;
  rootCause: FailureRootCause;
  dependencyHints: string[];
  stackFrames: string[];
  suggestedFixes: FailureSuggestedFix[];
  recoveryPlan: FailureRecoveryStep[];
  humanFinalAuthority: true;
  diagnosedAt: string;
}
