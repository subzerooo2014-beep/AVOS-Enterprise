export type AutonomousCapability =
  | "DECISION_INTAKE"
  | "POLICY_ENFORCEMENT"
  | "APPROVAL_ORCHESTRATION"
  | "WORKFLOW_EXECUTION"
  | "AGENT_EXECUTION"
  | "TOOL_EXECUTION"
  | "TASK_SCHEDULING"
  | "TRANSACTION_EXECUTION"
  | "CROSS_INDUSTRY_ORCHESTRATION"
  | "HUMAN_IN_THE_LOOP"
  | "AUTONOMY_LEVELS"
  | "EXECUTION_GUARDRAILS"
  | "RISK_CONTROLS"
  | "BUDGET_CONTROLS"
  | "RATE_LIMIT_CONTROLS"
  | "ROLLBACK_ENGINE"
  | "COMPENSATION_ENGINE"
  | "RETRY_ENGINE"
  | "DEAD_LETTER_HANDLING"
  | "EXECUTION_AUDIT"
  | "EVIDENCE_CAPTURE"
  | "EXECUTION_OBSERVABILITY"
  | "HEALTH_MONITORING"
  | "SLA_ENFORCEMENT"
  | "FAILOVER_EXECUTION"
  | "RECOVERY_ORCHESTRATION"
  | "AUTOMATION_TEMPLATES"
  | "EXECUTION_REGISTRY"
  | "AUTONOMOUS_OPERATIONS_CENTER"
  | "EXECUTION_COMMAND_CENTER";

export type AutonomyLevel =
  | "MANUAL"
  | "ASSISTED"
  | "SUPERVISED"
  | "CONDITIONAL_AUTONOMY"
  | "FULL_AUTONOMY";

export interface AutonomousExecutionPlan {
  id: string;
  tenantId: string;
  decisionId: string;
  name: string;
  capability: AutonomousCapability;
  autonomyLevel: AutonomyLevel;
  owner: string;
  steps: Array<{
    sequence: number;
    action: string;
    tool: string;
    requiresApproval: boolean;
    timeoutSeconds: number;
  }>;
  budgetLimit: number;
  currency: string;
  riskScore: number;
  status:
    | "DRAFT"
    | "VALIDATED"
    | "APPROVAL_PENDING"
    | "APPROVED"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "ROLLED_BACK";
  createdAt: string;
  updatedAt: string;
}

export interface AutonomousExecutionRun {
  id: string;
  planId: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "ROLLED_BACK";
  currentStep: number;
  completedSteps: number[];
  failedStep?: number;
  spentAmount: number;
  startedAt?: string;
  completedAt?: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionPolicyResult {
  allowed: boolean;
  violations: string[];
  requiredApprovals: string[];
  evaluatedAt: string;
}