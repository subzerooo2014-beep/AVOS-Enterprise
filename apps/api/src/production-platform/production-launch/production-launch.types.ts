export type LaunchGateStatus = "PASS" | "WARN" | "FAIL";

export type LaunchDomain =
  | "ADMIN"
  | "OPERATIONS"
  | "SECURITY"
  | "COMPLIANCE"
  | "PERFORMANCE"
  | "RESILIENCE"
  | "DISASTER_RECOVERY"
  | "GO_LIVE";

export interface LaunchGate {
  name: string;
  domain: LaunchDomain;
  status: LaunchGateStatus;
  required: boolean;
  evidence: string[];
  checkedAt: string;
}

export interface IncidentRecord {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  status: "OPEN" | "INVESTIGATING" | "MITIGATED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  auditTrail: string[];
}

export interface RecoveryDrill {
  id: string;
  type: "BACKUP_RESTORE" | "FAILOVER" | "REGION_RECOVERY";
  status: "PLANNED" | "RUNNING" | "PASSED" | "FAILED";
  startedAt: string;
  completedAt?: string;
  recoveryPointObjectiveMinutes: number;
  recoveryTimeObjectiveMinutes: number;
  evidence: string[];
}

export interface ProductionLaunchReadiness {
  system: "AVOS Production Platform";
  component: "Production Launch";
  readyForGoLive: boolean;
  status: "CERTIFIED" | "CONDITIONAL" | "BLOCKED";
  score: number;
  totalGates: number;
  passedGates: number;
  warnedGates: number;
  failedGates: number;
  generatedAt: string;
  gates: LaunchGate[];
}