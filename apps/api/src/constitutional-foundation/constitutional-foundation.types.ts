export type ConstitutionKey =
  | "TECHNICAL"
  | "BUSINESS"
  | "EXECUTIVE"
  | "GROWTH"
  | "TRUST";

export type ConstitutionalDecision =
  | "ALLOW"
  | "DENY"
  | "REQUIRE_APPROVAL"
  | "REVIEW";

export interface ConstitutionalPrinciple {
  key: string;
  title: string;
  description: string;
  mandatory: boolean;
}

export interface ConstitutionDefinition {
  key: ConstitutionKey;
  name: string;
  version: string;
  active: boolean;
  principles: ConstitutionalPrinciple[];
}

export interface ConstitutionalEvaluationRequest {
  tenantId: string;
  actorId: string;
  constitution: ConstitutionKey;
  action: string;
  resourceType: string;
  resourceId: string;
  context?: Record<string, unknown>;
}

export interface ConstitutionalEvaluationResult {
  id: string;
  tenantId: string;
  actorId: string;
  constitution: ConstitutionKey;
  action: string;
  resourceType: string;
  resourceId: string;
  decision: ConstitutionalDecision;
  matchedPrinciples: string[];
  reasons: string[];
  requiresHumanFinalDecision: boolean;
  createdAt: string;
}

export interface ConstitutionalApproval {
  id: string;
  evaluationId: string;
  tenantId: string;
  requestedBy: string;
  authorityRole: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConstitutionalAuditRecord {
  id: string;
  tenantId: string;
  actorId: string;
  constitution: ConstitutionKey;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}