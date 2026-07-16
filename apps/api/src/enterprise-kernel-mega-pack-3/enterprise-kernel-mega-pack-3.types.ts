export type KernelPrincipalType =
  | "human"
  | "service"
  | "agent"
  | "module"
  | "system";

export type KernelPermissionEffect =
  | "allow"
  | "deny";

export type KernelPolicyDecision =
  | "allow"
  | "deny"
  | "require-approval"
  | "allow-with-conditions";

export type KernelExecutionRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type KernelApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "cancelled";

export type KernelExecutionStatus =
  | "requested"
  | "authorized"
  | "waiting-approval"
  | "running"
  | "completed"
  | "failed"
  | "compensating"
  | "compensated"
  | "blocked";

export interface KernelSecurityPrincipal {
  id: string;
  type: KernelPrincipalType;
  displayName: string;
  roles: string[];
  attributes: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KernelPermission {
  id: string;
  principalId: string;
  resource: string;
  action: string;
  effect: KernelPermissionEffect;
  conditions: Array<{
    key: string;
    operator:
      | "equals"
      | "not-equals"
      | "contains"
      | "one-of"
      | "exists";
    value?: unknown;
  }>;
  priority: number;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelPolicy {
  id: string;
  name: string;
  description: string;
  version: string;
  scope: string[];
  priority: number;
  active: boolean;
  rules: Array<{
    id: string;
    resource: string;
    action: string;
    decision: KernelPolicyDecision;
    riskThreshold?: KernelExecutionRisk;
    conditions: Array<{
      key: string;
      operator:
        | "equals"
        | "not-equals"
        | "contains"
        | "one-of"
        | "exists";
      value?: unknown;
    }>;
    obligations: string[];
  }>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface KernelAuthorizationRequest {
  id: string;
  principalId: string;
  resource: string;
  action: string;
  risk: KernelExecutionRisk;
  context: Record<string, unknown>;
  correlationId: string;
  requestedAt: string;
}

export interface KernelAuthorizationDecision {
  id: string;
  requestId: string;
  principalId: string;
  resource: string;
  action: string;
  decision: KernelPolicyDecision;
  allowed: boolean;
  requiresHumanApproval: boolean;
  matchedPermissionIds: string[];
  matchedPolicyIds: string[];
  obligations: string[];
  reasons: string[];
  decidedAt: string;
}

export interface KernelApprovalRequest {
  id: string;
  authorizationDecisionId: string;
  executionRequestId?: string;
  requestedByPrincipalId: string;
  approverIdentityIds: string[];
  status: KernelApprovalStatus;
  reason: string;
  risk: KernelExecutionRisk;
  expiresAt?: string;
  approvedByIdentityId?: string;
  rejectedByIdentityId?: string;
  decisionReason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface KernelExecutionRequest {
  id: string;
  principalId: string;
  resource: string;
  action: string;
  risk: KernelExecutionRisk;
  reversible: boolean;
  payload: Record<string, unknown>;
  compensationPayload?: Record<string, unknown>;
  correlationId: string;
  requestedAt: string;
}

export interface KernelExecutionRecord {
  id: string;
  request: KernelExecutionRequest;
  authorizationDecisionId: string;
  approvalRequestId?: string;
  status: KernelExecutionStatus;
  result?: unknown;
  error?: string;
  compensationResult?: unknown;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface KernelTrustAssessment {
  id: string;
  principalId: string;
  resource: string;
  action: string;
  trustScore: number;
  confidence: number;
  risk: KernelExecutionRisk;
  reasons: string[];
  assessedAt: string;
}

export interface KernelGovernanceBinding {
  id: string;
  policyId: string;
  governanceDomain: string;
  controlIds: string[];
  mandatory: boolean;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface KernelSecurityHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    principalCoverageScore: number;
    permissionCoverageScore: number;
    policyCoverageScore: number;
    approvalControlScore: number;
    executionControlScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface KernelSecurityAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "principal"
    | "permission"
    | "policy"
    | "authorization"
    | "approval"
    | "execution"
    | "trust"
    | "governance"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
