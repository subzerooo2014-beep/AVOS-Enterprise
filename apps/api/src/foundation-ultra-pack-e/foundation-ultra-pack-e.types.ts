export interface ValueMetric {
  id: string;
  assetId: string;
  metric:
    | "revenue-impact"
    | "cost-reduction"
    | "risk-reduction"
    | "time-saved"
    | "reuse-score"
    | "strategic-value"
    | "trust-value";
  value: number;
  unit: string;
  period: string;
  source: string;
  confidence: number;
  evidence: string[];
  recordedAt: string;
}

export interface ValueAssessment {
  id: string;
  assetId: string;
  totalScore: number;
  financialScore: number;
  strategicScore: number;
  riskScore: number;
  reuseScore: number;
  trustScore: number;
  recommendations: string[];
  assessedAt: string;
}

export interface TrustEvidence {
  id: string;
  subjectId: string;
  evidenceType:
    | "identity"
    | "policy"
    | "audit"
    | "data-provenance"
    | "decision-trace"
    | "human-approval"
    | "compliance";
  source: string;
  reference: string;
  weight: number;
  valid: boolean;
  collectedAt: string;
}

export interface TrustProfile {
  id: string;
  subjectId: string;
  trustScore: number;
  level: "low" | "medium" | "high" | "excellent";
  evidenceIds: string[];
  explanations: string[];
  updatedAt: string;
}

export interface DecisionRecord {
  id: string;
  subject: string;
  objective: string;
  context: Record<string, unknown>;
  options: Array<{
    id: string;
    label: string;
    valueScore: number;
    riskScore: number;
    trustScore: number;
  }>;
  selectedOptionId: string;
  rationale: string[];
  evidence: string[];
  requiresHumanApproval: boolean;
  approvedBy?: string;
  status: "proposed" | "approved" | "rejected" | "executed";
  createdAt: string;
  updatedAt: string;
}

export interface FoundationPackSnapshot {
  key: "A" | "B" | "C" | "D" | "E";
  name: string;
  version: string;
  certified: boolean;
  score: number;
  checks: Record<string, boolean>;
}

export interface FoundationConsolidation {
  id: string;
  version: string;
  status: "draft" | "passed" | "failed" | "certified";
  score: number;
  packs: FoundationPackSnapshot[];
  checks: Record<string, boolean>;
  approvedBy?: string;
  createdAt: string;
}

export interface CertificationRecord {
  id: string;
  version: string;
  status: "not-certified" | "certified" | "rejected";
  score: number;
  approvedBy?: string;
  checks: Record<string, boolean>;
  createdAt: string;
}