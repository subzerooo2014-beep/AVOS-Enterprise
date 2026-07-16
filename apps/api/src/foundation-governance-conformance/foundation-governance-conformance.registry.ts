import { FoundationGovernanceConformanceCapability } from "./foundation-governance-conformance.types";

export const FOUNDATION_GOVERNANCE_CONFORMANCE_CAPABILITIES: Readonly<Record<FoundationGovernanceConformanceCapability, string>> = {
  EVIDENCE_BASED_CONFORMANCE: "Evidence Based Conformance",
  MANDATORY_STAGE_ORDERING: "Mandatory Stage Ordering",
  PRODUCTION_READINESS_GATES: "Production Readiness Gates",
  ARCHITECTURE_CONFORMANCE: "Architecture Conformance",
  GOVERNANCE_VALIDATION: "Governance Validation",
  STAGE_DEPENDENCY_CONTROL: "Stage Dependency Control",
  CONFORMANCE_REPORTING: "Conformance Reporting",
  EXCEPTION_MANAGEMENT: "Exception Management",
  APPROVAL_GATES: "Approval Gates",
  AUDIT_EVIDENCE: "Audit Evidence",
};