export type AvosFactoryCoreCompletionValidationStatus =
  | "pending"
  | "passed"
  | "failed";

export type AvosFactoryCoreCompletionCertificationStatus =
  | "pending"
  | "certified"
  | "rejected";

export interface AvosFactoryCoreCompletionValidationCheck {
  name: string;
  passed: boolean;
  weight: number;
  details: string;
}

export interface AvosFactoryCoreCompletionValidationReport {
  id: string;
  subjectId: string;
  version: string;
  status: AvosFactoryCoreCompletionValidationStatus;
  score: number;
  checks: AvosFactoryCoreCompletionValidationCheck[];
  blockingFindings: string[];
  validatedBy: string;
  generatedAt: string;
}

export interface AvosFactoryCoreCompletionCertification {
  id: string;
  validationReportId: string;
  subjectId: string;
  version: string;
  status: AvosFactoryCoreCompletionCertificationStatus;
  score: number;
  certifiedBy: string;
  approvedBy: string;
  humanApproved: boolean;
  issuedAt: string;
}

export interface AvosFactoryCoreCompletionHealthReport {
  id: string;
  score: number;
  level: "excellent" | "healthy" | "degraded" | "critical";
  metrics: Record<string, number>;
  reasons: string[];
  calculatedAt: string;
}

export interface AvosFactoryCoreCompletionSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
