export type OperationalStatus =
  | "operational"
  | "degraded"
  | "failed"
  | "pending";

export type CertificationStatus =
  | "certified"
  | "not-certified";

export interface HealthCheckResult {
  name: string;
  status: OperationalStatus;
  score: number;
  checkedAt: string;
  details?: Record<string, unknown>;
}

export interface ProductionCertificationResult {
  id: string;
  name: string;
  version: string;
  status: CertificationStatus;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  approvedBy: string;
  certifiedAt: string | null;
  generatedAt: string;
}