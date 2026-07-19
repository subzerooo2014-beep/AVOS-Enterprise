export type OmegaSeverity = "info" | "low" | "medium" | "high" | "critical";
export type OmegaDecision = "approved" | "conditional" | "rejected";

export interface OmegaFinding {
  readonly id: string;
  readonly source: string;
  readonly category: string;
  readonly severity: OmegaSeverity;
  readonly title: string;
  readonly description: string;
  readonly evidence: readonly Record<string, unknown>[];
  readonly recommendations: readonly string[];
}

export interface OmegaScore {
  readonly quality: number;
  readonly trust: number;
  readonly risk: number;
  readonly readiness: number;
  readonly technicalDebt: number;
}

export interface OmegaRule {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly severity: OmegaSeverity;
  readonly enabled: boolean;
  readonly weight: number;
  readonly description: string;
}

export interface OmegaPolicy {
  readonly id: string;
  readonly name: string;
  readonly minimumQuality: number;
  readonly maximumRisk: number;
  readonly minimumTrust: number;
  readonly requireHumanApproval: boolean;
}

export interface OmegaAssessment {
  readonly assessmentId: string;
  readonly generatedAt: string;
  readonly version: string;
  readonly score: OmegaScore;
  readonly decision: OmegaDecision;
  readonly findings: readonly OmegaFinding[];
  readonly rulesEvaluated: number;
  readonly policiesEvaluated: number;
  readonly humanFinalAuthority: true;
}

export interface OmegaDashboardSnapshot {
  readonly generatedAt: string;
  readonly totalAssessments: number;
  readonly latestDecision: OmegaDecision | "none";
  readonly averageQuality: number;
  readonly averageRisk: number;
  readonly criticalFindings: number;
  readonly activeRules: number;
  readonly activePolicies: number;
}
