export type EnterpriseRiskResilienceG6Capability =
  | "ENTERPRISE_RISK_RADAR"
  | "RESILIENCE_SIMULATION"
  | "INCIDENT_PREDICTION"
  | "BUSINESS_CONTINUITY"
  | "THREAT_INTELLIGENCE"
  | "COMPLIANCE_MONITORING"
  | "RECOVERY_ORCHESTRATION"
  | "DEPENDENCY_RISK"
  | "OPERATIONAL_RESILIENCE"
  | "CRISIS_COMMAND"
  | "POLICY_ENFORCEMENT"
  | "RISK_EVIDENCE";

export interface EnterpriseRiskResilienceG6Record {
  id: string;
  capability: EnterpriseRiskResilienceG6Capability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}