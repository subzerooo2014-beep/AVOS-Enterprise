export type PartnerStatus =
  | "APPLIED"
  | "VERIFIED"
  | "ACTIVE"
  | "SUSPENDED"
  | "TERMINATED";

export interface PartnerProfile {
  id: string;
  industryKey: string;
  tenantId: string;
  organizationId: string;
  partnerType:
    | "DEALER"
    | "WORKSHOP"
    | "INSURER"
    | "BANK"
    | "LOGISTICS"
    | "INSPECTOR"
    | "SUPPLIER"
    | "MARKETPLACE";
  status: PartnerStatus;
  verificationScore: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionPolicy {
  id: string;
  tenantId: string;
  name: string;
  resource: string;
  actions: string[];
  roles: string[];
  effect: "ALLOW" | "DENY";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  tenantId: string;
  requesterId: string;
  approverRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceCheck {
  id: string;
  tenantId: string;
  industryKey: string;
  entityType: string;
  entityId: string;
  policyKey: string;
  status: "PASS" | "FAIL" | "REVIEW";
  findings: string[];
  createdAt: string;
}

export interface RiskAssessment {
  id: string;
  tenantId: string;
  industryKey: string;
  subjectType: string;
  subjectId: string;
  riskScore: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  controls: string[];
  blocked: boolean;
  createdAt: string;
}

export interface PartnerAgreement {
  id: string;
  tenantId: string;
  partnerId: string;
  agreementType: string;
  version: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED";
  terms: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SlaRecord {
  id: string;
  tenantId: string;
  partnerId: string;
  capabilityKey: string;
  targetMinutes: number;
  escalationMinutes: number;
  breachCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerSettlement {
  id: string;
  tenantId: string;
  partnerId: string;
  period: string;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  currency: string;
  status: "DRAFT" | "APPROVED" | "PAID" | "DISPUTED";
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceAuditRecord {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}