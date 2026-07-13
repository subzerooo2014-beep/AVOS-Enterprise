export type FlowRiskLevel = "low" | "medium" | "high" | "critical";

export type FlowRiskAssessment = {
  id: string;
  executionId: string;
  score: number;
  level: FlowRiskLevel;
  findings: string[];
  assessedAt: string;
};

export type FlowPolicyDecision = {
  id: string;
  executionId: string;
  policy: string;
  effect: "allow" | "deny" | "review";
  reason: string;
  decidedAt: string;
};

export type FlowComplianceEvidence = {
  id: string;
  executionId: string;
  control: string;
  status: "compliant" | "non-compliant" | "not-applicable";
  evidence: Record<string, unknown>;
  recordedAt: string;
};

export type FlowEscalation = {
  id: string;
  executionId: string;
  severity: FlowRiskLevel;
  reason: string;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  resolvedAt?: string;
};
