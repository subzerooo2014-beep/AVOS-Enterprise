export type BrainReasoningType =
  | "rule"
  | "constraint"
  | "causal"
  | "multi-step";

export type BrainReasoningStatus =
  | "created"
  | "running"
  | "completed"
  | "failed"
  | "blocked";

export type BrainPlanStatus =
  | "draft"
  | "ready"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "cancelled";

export type BrainTaskStatus =
  | "pending"
  | "ready"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "skipped";

export interface BrainRule {
  id: string;
  name: string;
  description: string;
  expression: string;
  priority: number;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainConstraint {
  id: string;
  name: string;
  description: string;
  kind: "required" | "forbidden" | "range" | "dependency" | "approval";
  field?: string;
  operator?: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not-in";
  value?: unknown;
  dependencyId?: string;
  requiresHumanApproval: boolean;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainReasoningStep {
  id: string;
  order: number;
  type: BrainReasoningType;
  input: Record<string, unknown>;
  output?: unknown;
  confidence: number;
  status: BrainReasoningStatus;
  rationale?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BrainReasoningRun {
  id: string;
  question: string;
  context: Record<string, unknown>;
  ruleIds: string[];
  constraintIds: string[];
  steps: BrainReasoningStep[];
  conclusion?: unknown;
  confidence: number;
  status: BrainReasoningStatus;
  correlationId: string;
  traceId: string;
  createdByIdentityId: string;
  createdAt: string;
  completedAt?: string;
}

export interface BrainCausalNode {
  id: string;
  name: string;
  description: string;
  kind: "cause" | "effect" | "condition" | "intervention";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainCausalEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  strength: number;
  confidence: number;
  condition?: string;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainDecisionGraphNode {
  id: string;
  label: string;
  kind: "question" | "option" | "evidence" | "risk" | "outcome";
  score: number;
  confidence: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainDecisionGraphEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relation: "supports" | "opposes" | "leads-to" | "depends-on";
  weight: number;
  confidence: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainPlanTask {
  id: string;
  title: string;
  description: string;
  order: number;
  dependencies: string[];
  constraints: string[];
  requiredCapabilities: string[];
  estimatedEffort: number;
  priority: "low" | "medium" | "high" | "critical";
  status: BrainTaskStatus;
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  startedAt?: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
}

export interface BrainExecutionPlan {
  id: string;
  goalId: string;
  name: string;
  description: string;
  strategy: string;
  tasks: BrainPlanTask[];
  status: BrainPlanStatus;
  progress: number;
  reversible: boolean;
  recoveryPlanId?: string;
  approvedByIdentityId?: string;
  correlationId: string;
  traceId: string;
  createdByIdentityId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainRecoveryPlan {
  id: string;
  executionPlanId: string;
  triggers: string[];
  actions: Array<{
    id: string;
    order: number;
    action: "retry" | "skip" | "rollback" | "replan" | "human-intervention";
    description: string;
    required: boolean;
  }>;
  status: "draft" | "ready" | "executed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface BrainReasoningPlanningHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    ruleScore: number;
    constraintScore: number;
    causalScore: number;
    reasoningScore: number;
    decisionGraphScore: number;
    planningScore: number;
    recoveryScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainReasoningAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "rule"
    | "constraint"
    | "reasoning"
    | "causal"
    | "decision-graph"
    | "planning"
    | "task"
    | "recovery"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
