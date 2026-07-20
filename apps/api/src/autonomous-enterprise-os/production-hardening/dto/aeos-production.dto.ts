export type AeosOperationalSeverity =
  | "info"
  | "warning"
  | "critical";

export interface RuntimeSignalDto {
  unit: string;
  healthy?: boolean;
  latencyMs?: number;
  errorRate?: number;
  throughput?: number;
  capacityUsed?: number;
  slaTargetMs?: number;
  metadata?: Record<string, unknown>;
}

export interface RecoveryRequestDto {
  unit: string;
  reason: string;
  approvedBy?: string;
}

export interface WorkloadRequestDto {
  workloadId: string;
  priority?: number;
  requiredCapacity?: number;
  candidateUnits?: string[];
}

export interface OperationalIncident {
  id: string;
  unit: string;
  severity: AeosOperationalSeverity;
  category: string;
  summary: string;
  detectedAt: string;
  evidence: Record<string, unknown>;
}

export interface AeosProductionCertificate {
  id: string;
  version: "AEOS-1.1.0";
  status: "certified";
  score: number;
  approvedBy: string;
  certifiedAt: string;
}