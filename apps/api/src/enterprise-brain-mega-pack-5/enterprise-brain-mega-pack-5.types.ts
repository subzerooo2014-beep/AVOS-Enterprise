export type BrainAgentStatus =
  | "registered"
  | "ready"
  | "busy"
  | "paused"
  | "degraded"
  | "offline"
  | "blocked";

export type BrainAgentTrustLevel =
  | "untrusted"
  | "restricted"
  | "trusted"
  | "system";

export type BrainCoordinationStatus =
  | "draft"
  | "ready"
  | "running"
  | "waiting-human-approval"
  | "completed"
  | "failed"
  | "cancelled";

export type BrainDelegationStatus =
  | "proposed"
  | "accepted"
  | "running"
  | "completed"
  | "failed"
  | "rejected";

export type BrainConsensusDecision =
  | "approved"
  | "approved-with-conditions"
  | "rejected"
  | "deadlock";

export interface BrainAgentDescriptor {
  id: string;
  name: string;
  description: string;
  version: string;
  status: BrainAgentStatus;
  trustLevel: BrainAgentTrustLevel;
  capabilities: string[];
  permissions: string[];
  supportedTaskTypes: string[];
  maxConcurrentTasks: number;
  currentTasks: number;
  reliabilityScore: number;
  qualityScore: number;
  costScore: number;
  latencyScore: number;
  requiresHumanApprovalFor: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainSharedContext {
  id: string;
  scopeId: string;
  key: string;
  value: unknown;
  visibleToAgentIds: string[];
  writableByAgentIds: string[];
  sensitive: boolean;
  version: number;
  sourceAgentId?: string;
  sourceIdentityId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BrainDelegation {
  id: string;
  coordinationId: string;
  taskId: string;
  fromAgentId: string;
  toAgentId: string;
  reason: string;
  requiredCapabilities: string[];
  contextIds: string[];
  priority: "low" | "medium" | "high" | "critical";
  status: BrainDelegationStatus;
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainCoordinationTask {
  id: string;
  title: string;
  description: string;
  taskType: string;
  requiredCapabilities: string[];
  dependencies: string[];
  assignedAgentId?: string;
  status:
    | "pending"
    | "assigned"
    | "running"
    | "waiting-human-approval"
    | "completed"
    | "failed"
    | "skipped";
  requiresHumanApproval: boolean;
  result?: unknown;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface BrainCoordinationPlan {
  id: string;
  name: string;
  objective: string;
  tasks: BrainCoordinationTask[];
  participatingAgentIds: string[];
  sharedContextIds: string[];
  status: BrainCoordinationStatus;
  progress: number;
  supervisorAgentId: string;
  approvedByIdentityId?: string;
  correlationId: string;
  traceId: string;
  createdByIdentityId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BrainConsensusVote {
  id: string;
  consensusId: string;
  agentId: string;
  optionId: string;
  confidence: number;
  rationale: string;
  conditions: string[];
  createdAt: string;
}

export interface BrainConsensusSession {
  id: string;
  subjectId: string;
  question: string;
  optionIds: string[];
  requiredAgentIds: string[];
  minimumParticipation: number;
  approvalThreshold: number;
  votes: BrainConsensusVote[];
  decision?: BrainConsensusDecision;
  selectedOptionId?: string;
  conditions: string[];
  status: "open" | "decided" | "deadlock" | "cancelled";
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainConflictRecord {
  id: string;
  subjectId: string;
  agentIds: string[];
  conflictType:
    | "goal"
    | "priority"
    | "resource"
    | "policy"
    | "evidence"
    | "decision";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  proposals: Array<{
    agentId: string;
    proposal: string;
    confidence: number;
  }>;
  resolution?: string;
  resolvedBy: "rule" | "consensus" | "supervisor" | "human";
  status: "open" | "resolved" | "escalated";
  approvedByIdentityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainSupervisorDecision {
  id: string;
  subjectId: string;
  action:
    | "assign"
    | "reassign"
    | "pause"
    | "resume"
    | "escalate"
    | "approve"
    | "reject"
    | "recover";
  targetAgentId?: string;
  targetTaskId?: string;
  rationale: string;
  confidence: number;
  riskScore: number;
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  status: "proposed" | "approved" | "rejected" | "executed";
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainAgentGovernancePolicy {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  active: boolean;
  checks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrainMultiAgentHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    registryScore: number;
    availabilityScore: number;
    coordinationScore: number;
    delegationScore: number;
    consensusScore: number;
    conflictScore: number;
    supervisorScore: number;
    governanceScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface BrainMultiAgentAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "agent"
    | "coordination"
    | "delegation"
    | "consensus"
    | "conflict"
    | "context"
    | "supervisor"
    | "governance"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
