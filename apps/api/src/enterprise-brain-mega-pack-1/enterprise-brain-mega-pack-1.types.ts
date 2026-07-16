export type BrainRuntimeStatus =
  | "stopped"
  | "starting"
  | "ready"
  | "degraded"
  | "safe"
  | "failed";

export type BrainSessionStatus =
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed";

export type BrainContextScope =
  | "session"
  | "user"
  | "organization"
  | "capability"
  | "workflow"
  | "decision"
  | "global";

export type BrainIntentCategory =
  | "question"
  | "command"
  | "analysis"
  | "planning"
  | "decision"
  | "execution"
  | "monitoring"
  | "unknown";

export type BrainGoalStatus =
  | "draft"
  | "active"
  | "blocked"
  | "completed"
  | "cancelled"
  | "failed";

export type BrainDecisionStatus =
  | "requested"
  | "analyzing"
  | "waiting-human-approval"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";

export interface BrainRuntimeState {
  id: string;
  status: BrainRuntimeStatus;
  version: string;
  startedAt?: string;
  stoppedAt?: string;
  activeSessions: number;
  activeGoals: number;
  pendingDecisions: number;
  safeMode: boolean;
  degradedReasons: string[];
  updatedAt: string;
}

export interface BrainSession {
  id: string;
  ownerIdentityId: string;
  organizationId?: string;
  title: string;
  status: BrainSessionStatus;
  contextIds: string[];
  intentIds: string[];
  goalIds: string[];
  decisionIds: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainContextEntry {
  id: string;
  scope: BrainContextScope;
  scopeId: string;
  key: string;
  value: unknown;
  source: string;
  confidence: number;
  sensitive: boolean;
  expiresAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainIntent {
  id: string;
  sessionId: string;
  rawInput: string;
  normalizedInput: string;
  category: BrainIntentCategory;
  confidence: number;
  entities: Array<{
    name: string;
    value: string;
    confidence: number;
  }>;
  constraints: string[];
  requiresClarification: boolean;
  clarificationQuestions: string[];
  createdAt: string;
}

export interface BrainGoal {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  status: BrainGoalStatus;
  priority: "low" | "medium" | "high" | "critical";
  parentGoalId?: string;
  dependencies: string[];
  constraints: string[];
  successCriteria: string[];
  progress: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainDecisionOption {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  risks: string[];
  score: number;
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface BrainDecisionRequest {
  id: string;
  sessionId: string;
  goalId?: string;
  question: string;
  contextIds: string[];
  options: BrainDecisionOption[];
  selectedOptionId?: string;
  rationale?: string;
  confidence?: number;
  riskScore?: number;
  status: BrainDecisionStatus;
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  rejectedByIdentityId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainRegistryEntry {
  id: string;
  type:
    | "runtime"
    | "session"
    | "context"
    | "intent"
    | "goal"
    | "decision"
    | "service";
  name: string;
  version: string;
  active: boolean;
  capabilities: string[];
  dependencies: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    runtimeScore: number;
    sessionScore: number;
    contextScore: number;
    intentScore: number;
    goalScore: number;
    decisionScore: number;
    registryScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "runtime"
    | "session"
    | "context"
    | "intent"
    | "goal"
    | "decision"
    | "registry"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
