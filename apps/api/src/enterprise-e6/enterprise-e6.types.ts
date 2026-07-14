export type EnterpriseAnomalySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EnterpriseRemediationStatus =
  | "PLANNED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface EnterpriseAnomaly {
  id: string;
  source: string;
  code: string;
  severity: EnterpriseAnomalySeverity;
  details: Record<string, unknown>;
  detectedAt: string;
}

export interface EnterpriseRemediationPlan {
  id: string;
  anomalyId: string;
  actions: string[];
  status: EnterpriseRemediationStatus;
  createdAt: string;
  completedAt?: string;
}

export interface EnterpriseRecoverySnapshot {
  detectedAnomalies: number;
  activePlans: number;
  completedPlans: number;
  failedPlans: number;
  selfHealingReadiness: number;
  autonomousOperations: boolean;
  generatedAt: string;
}

export interface EnterpriseAutonomousOperationResult {
  success: boolean;
  status: "COMPLETED" | "DEGRADED" | "FAILED";
  anomaly?: EnterpriseAnomaly;
  remediation?: EnterpriseRemediationPlan;
  recovery: EnterpriseRecoverySnapshot;
  completedAt: string;
}