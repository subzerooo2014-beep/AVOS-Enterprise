export type ArchitectureCompliancePlatformCapability =
  | "ARCHITECTURE_VALIDATION"
  | "API_STANDARDS_VALIDATION"
  | "VERSION_COMPATIBILITY_MATRIX"
  | "PRODUCTION_READINESS_GATES"
  | "ARCHITECTURE_CERTIFICATION"
  | "CONFORMANCE_EVIDENCE"
  | "REFERENCE_ARCHITECTURE_CONTROL"
  | "POLICY_AS_CODE"
  | "QUALITY_GATES"
  | "COMPLIANCE_REPORTING";

export interface ArchitectureCompliancePlatformRecord {
  id: string;
  capability: ArchitectureCompliancePlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}