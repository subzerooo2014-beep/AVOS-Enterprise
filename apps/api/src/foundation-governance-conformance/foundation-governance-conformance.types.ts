export type FoundationGovernanceConformanceCapability =
  | "EVIDENCE_BASED_CONFORMANCE"
  | "MANDATORY_STAGE_ORDERING"
  | "PRODUCTION_READINESS_GATES"
  | "ARCHITECTURE_CONFORMANCE"
  | "GOVERNANCE_VALIDATION"
  | "STAGE_DEPENDENCY_CONTROL"
  | "CONFORMANCE_REPORTING"
  | "EXCEPTION_MANAGEMENT"
  | "APPROVAL_GATES"
  | "AUDIT_EVIDENCE";

export interface FoundationGovernanceConformanceRecord {
  id: string;
  capability: FoundationGovernanceConformanceCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}