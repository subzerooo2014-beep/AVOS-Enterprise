export interface DecisionCaseV2 {
  id: string;
  title: string;
  objective: string;
  status: "DRAFT" | "ANALYZING" | "APPROVED" | "REJECTED" | "EXECUTED";
  options: string[];
  owner: string;
  selectedOption?: string;
  confidence?: number;
  rationale?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionScenarioV2 {
  id: string;
  decisionId: string;
  name: string;
  assumptions: Record<string, unknown>;
  benefitScore: number;
  riskScore: number;
  costScore: number;
  feasibilityScore: number;
  createdAt: string;
}

export interface DecisionRecommendationV2 {
  id: string;
  decisionId: string;
  option: string;
  totalScore: number;
  reasons: string[];
  createdAt: string;
}

export interface DecisionApprovalV2 {
  id: string;
  decisionId: string;
  approver: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface DecisionAuditV2 {
  id: string;
  decisionId: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface DecisionMetricsV2 {
  decisions: number;
  approvedDecisions: number;
  rejectedDecisions: number;
  scenarios: number;
  recommendations: number;
  pendingApprovals: number;
  auditRecords: number;
}

export interface DecisionHealthV2 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: DecisionMetricsV2;
  components: Record<string, string>;
}
