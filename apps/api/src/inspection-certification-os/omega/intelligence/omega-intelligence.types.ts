export interface OmegaIntelligenceFinding {
  readonly id: string;
  readonly category: string;
  readonly severity: "info" | "low" | "medium" | "high" | "critical";
  readonly title: string;
  readonly description: string;
  readonly evidence: readonly Record<string, unknown>[];
  readonly recommendations: readonly string[];
}

export interface OmegaIntelligenceSection {
  readonly name: string;
  readonly status:
    | "healthy"
    | "attention"
    | "critical"
    | "available"
    | "not-configured"
    | "heuristic-only";
  readonly score: number;
  readonly findings: readonly OmegaIntelligenceFinding[];
  readonly metrics: Readonly<Record<string, unknown>>;
}

export interface OmegaIntelligenceReport {
  readonly reportId: string;
  readonly generatedAt: string;
  readonly version: string;
  readonly repositoryRoot: string;
  readonly apiRoot: string;
  readonly sections: readonly OmegaIntelligenceSection[];
  readonly overallScore: number;
  readonly readiness: {
    readonly level:
      | "production-ready"
      | "conditionally-ready"
      | "remediation-required";
    readonly blockers: readonly string[];
    readonly warnings: readonly string[];
  };
  readonly governance: {
    readonly humanFinalAuthority: true;
    readonly autonomousFinalApproval: false;
    readonly nonDestructive: true;
  };
}
