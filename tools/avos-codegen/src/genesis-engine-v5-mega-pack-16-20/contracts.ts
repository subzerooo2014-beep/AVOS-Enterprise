export type V5OperationsPrimitive = string | number | boolean | null;
export type V5OperationsValue =
  | V5OperationsPrimitive
  | V5OperationsValue[]
  | { [key: string]: V5OperationsValue };

export enum V5OperationsStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5OperationsService {
  key: string;
  criticality: "low" | "medium" | "high";
  dependencies: string[];
  targetAvailability?: number;
  targetLatencyMs?: number;
}

export interface V5OperationsInput {
  systemKey: string;
  services: V5OperationsService[];
  enableAutoRemediation?: boolean;
  enableRollback?: boolean;
  enableCapacityAutomation?: boolean;
  enableEvidence?: boolean;
}

export interface V5SloDefinition {
  serviceKey: string;
  availabilityTarget: number;
  latencyTargetMs: number;
  errorBudgetPercent: number;
  measurementWindowDays: number;
}

export interface V5IncidentRule {
  key: string;
  serviceKey: string;
  severity: "warning" | "critical";
  condition: string;
  evaluationWindowMinutes: number;
}

export interface V5Runbook {
  key: string;
  serviceKey: string;
  trigger: string;
  steps: string[];
  requiresApproval: boolean;
}

export interface V5RemediationAction {
  key: string;
  serviceKey: string;
  action: string;
  safeToAutomate: boolean;
  rollbackAction: string;
}

export interface V5CapacityDecision {
  serviceKey: string;
  metric: string;
  scaleOutThreshold: number;
  scaleInThreshold: number;
  minReplicas: number;
  maxReplicas: number;
}
