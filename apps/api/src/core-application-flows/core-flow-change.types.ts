export type ChangeStatus =
  | "draft"
  | "assessed"
  | "approved"
  | "scheduled"
  | "executed"
  | "rolled-back";

export type FlowChangeRequest = {
  id: string;
  flow: string;
  title: string;
  description: string;
  requestedBy: string;
  riskScore: number;
  status: ChangeStatus;
  createdAt: string;
  executedAt?: string;
};

export type FlowImpactAssessment = {
  id: string;
  changeId: string;
  affectedComponents: string[];
  affectedFlows: string[];
  severity: "low" | "medium" | "high" | "critical";
  findings: string[];
  assessedAt: string;
};

export type FlowReleaseGate = {
  id: string;
  changeId: string;
  name: string;
  status: "pending" | "passed" | "failed" | "waived";
  reason?: string;
  evaluatedAt?: string;
};

export type FlowRollbackPlan = {
  id: string;
  changeId: string;
  actions: string[];
  tested: boolean;
  createdAt: string;
  testedAt?: string;
};
