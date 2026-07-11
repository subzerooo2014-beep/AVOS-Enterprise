export type EvolutionJsonPrimitive =
  | string
  | number
  | boolean
  | null;

export type EvolutionJsonValue =
  | EvolutionJsonPrimitive
  | EvolutionJsonValue[]
  | {
      [key: string]: EvolutionJsonValue;
    };

export enum EvolutionProposalStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  ANALYZING = "analyzing",
  APPROVED = "approved",
  REJECTED = "rejected",
  SCHEDULED = "scheduled",
  EXECUTING = "executing",
  COMPLETED = "completed",
  FAILED = "failed",
  ROLLED_BACK = "rolled_back",
}

export enum EvolutionRiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum EvolutionDecision {
  APPROVE = "approve",
  APPROVE_WITH_CONTROLS = "approve_with_controls",
  REQUIRE_REVIEW = "require_review",
  REJECT = "reject",
}

export interface EvolutionProposal {
  id: string;
  key: string;
  title: string;
  description: string;
  source: string;
  status: EvolutionProposalStatus;
  objectives: string[];
  affectedCapabilities: string[];
  affectedBlueprints: string[];
  dependencies: string[];
  expectedBenefits: string[];
  knownRisks: string[];
  estimatedEffort: number;
  estimatedImpact: number;
  metadata: Record<string, EvolutionJsonValue>;
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionControl {
  key: string;
  name: string;
  description: string;
  mandatory: boolean;
  evidenceRequired: boolean;
  metadata: Record<string, EvolutionJsonValue>;
}

export interface EvolutionRiskAssessment {
  proposalId: string;
  score: number;
  level: EvolutionRiskLevel;
  findings: string[];
  controls: EvolutionControl[];
  assessedAt: string;
}

export interface BlueprintCompatibilityFinding {
  blueprintKey: string;
  compatible: boolean;
  requiredVersion?: string;
  currentVersion?: string;
  reasons: string[];
}

export interface BlueprintCompatibilityReport {
  proposalId: string;
  compatible: boolean;
  findings: BlueprintCompatibilityFinding[];
  generatedAt: string;
}

export interface EvolutionPolicyRule {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  evaluate(
    context: EvolutionPolicyContext,
  ): EvolutionPolicyRuleResult;
}

export interface EvolutionPolicyContext {
  proposal: EvolutionProposal;
  risk: EvolutionRiskAssessment;
  compatibility: BlueprintCompatibilityReport;
}

export interface EvolutionPolicyRuleResult {
  ruleKey: string;
  passed: boolean;
  blocking: boolean;
  message: string;
  controls: EvolutionControl[];
}

export interface EvolutionPolicyDecision {
  proposalId: string;
  decision: EvolutionDecision;
  approved: boolean;
  ruleResults: EvolutionPolicyRuleResult[];
  controls: EvolutionControl[];
  reasons: string[];
  decidedAt: string;
}

export interface EvolutionExecutionStep {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  dependencies: string[];
  controls: EvolutionControl[];
  metadata: Record<string, EvolutionJsonValue>;
}

export interface EvolutionExecutionPlan {
  proposalId: string;
  decision: EvolutionDecision;
  steps: EvolutionExecutionStep[];
  rollbackSteps: EvolutionExecutionStep[];
  generatedAt: string;
}

export interface EvolutionAuditEntry {
  id: string;
  proposalId: string;
  action: string;
  actor: string;
  message: string;
  metadata: Record<string, EvolutionJsonValue>;
  createdAt: string;
}

export interface EvolutionGovernanceResult {
  success: boolean;
  proposal: EvolutionProposal;
  risk: EvolutionRiskAssessment;
  compatibility: BlueprintCompatibilityReport;
  decision: EvolutionPolicyDecision;
  plan?: EvolutionExecutionPlan;
  auditEntries: EvolutionAuditEntry[];
  completedAt: string;
}
