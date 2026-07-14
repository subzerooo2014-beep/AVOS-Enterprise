export type EnterpriseIncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EnterpriseIncidentStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "MITIGATING"
  | "RESOLVED";

export interface EnterpriseIncident {
  id: string;
  title: string;
  source: string;
  severity: EnterpriseIncidentSeverity;
  status: EnterpriseIncidentStatus;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  metadata: Record<string, unknown>;
}

export interface EnterpriseControlResult {
  allowed: boolean;
  controls: string[];
  reasons: string[];
  evaluatedAt: string;
}

export interface EnterpriseReliabilitySnapshot {
  availability: number;
  errorBudgetRemaining: number;
  activeIncidents: number;
  criticalIncidents: number;
  recoveryReadiness: number;
  generatedAt: string;
}

export interface EnterpriseOperationResult {
  operationId: string;
  status: "COMPLETED" | "BLOCKED" | "DEGRADED";
  governance: EnterpriseControlResult;
  reliability: EnterpriseReliabilitySnapshot;
  actions: string[];
  completedAt: string;
}