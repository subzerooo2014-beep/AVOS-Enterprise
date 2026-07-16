import { ArchitectureCompliancePlatformCapability } from "./architecture-compliance-platform.types";

export const ARCHITECTURE_COMPLIANCE_PLATFORM_CAPABILITIES: Readonly<Record<ArchitectureCompliancePlatformCapability, string>> = {
  ARCHITECTURE_VALIDATION: "Architecture Validation",
  API_STANDARDS_VALIDATION: "Api Standards Validation",
  VERSION_COMPATIBILITY_MATRIX: "Version Compatibility Matrix",
  PRODUCTION_READINESS_GATES: "Production Readiness Gates",
  ARCHITECTURE_CERTIFICATION: "Architecture Certification",
  CONFORMANCE_EVIDENCE: "Conformance Evidence",
  REFERENCE_ARCHITECTURE_CONTROL: "Reference Architecture Control",
  POLICY_AS_CODE: "Policy As Code",
  QUALITY_GATES: "Quality Gates",
  COMPLIANCE_REPORTING: "Compliance Reporting",
};