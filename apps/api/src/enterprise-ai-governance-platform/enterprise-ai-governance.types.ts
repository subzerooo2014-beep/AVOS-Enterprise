export type AiGovernanceEffect = "ALLOW" | "DENY" | "REVIEW";
export type AiRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AiGovernancePolicyRecord {
  id: string;
  name: string;
  domain: string;
  version: string;
  priority: number;
  effect: AiGovernanceEffect;
  enabled: boolean;
  conditions: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AiGovernedModelRecord {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "EXPERIMENTAL" | "RETIRED";
  capabilities: string[];
  riskLevel: AiRiskLevel;
  owner: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiGovernedPromptRecord {
  id: string;
  name: string;
  version: string;
  template: string;
  variables: string[];
  status: "DRAFT" | "APPROVED" | "REJECTED" | "RETIRED";
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiEvaluationRecord {
  id: string;
  modelId: string;
  promptId?: string;
  accuracy: number;
  safety: number;
  relevance: number;
  latencyMs: number;
  passed: boolean;
  notes: string[];
  evaluatedAt: string;
}

export interface AiRiskAssessmentRecord {
  id: string;
  targetType: "MODEL" | "PROMPT" | "WORKFLOW";
  targetId: string;
  level: AiRiskLevel;
  score: number;
  findings: string[];
  mitigations: string[];
  assessedAt: string;
}

export interface AiAuditRecord {
  id: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AiComplianceReport {
  compliant: boolean;
  score: number;
  checkedAt: string;
  violations: {
    code: string;
    component: string;
    message: string;
  }[];
}

export interface AiGovernanceMetrics {
  policies: number;
  models: number;
  approvedModels: number;
  prompts: number;
  approvedPrompts: number;
  evaluations: number;
  failedEvaluations: number;
  riskAssessments: number;
  highRiskItems: number;
  audits: number;
}

export interface AiGovernanceHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AiGovernanceMetrics;
  components: Record<string, string>;
}
