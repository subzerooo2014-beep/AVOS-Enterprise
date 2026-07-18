export type AvosFactoryValidationSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type AvosFactoryValidationStatus =
  | "pending"
  | "passed"
  | "failed"
  | "waived";

export type AvosFactoryQualityGateStatus =
  | "open"
  | "passed"
  | "blocked"
  | "approved"
  | "rejected";

export interface AvosFactoryValidationRule {
  id: string;
  name: string;
  category:
    | "architecture"
    | "maintainability"
    | "scalability"
    | "security"
    | "documentation"
    | "reliability"
    | "reuse"
    | "governance";
  description: string;
  severity: AvosFactoryValidationSeverity;
  threshold: number;
  enabled: boolean;
  requiresHumanApproval: boolean;
  createdAt: string;
}

export interface AvosFactoryValidationFinding {
  id: string;
  ruleId: string;
  subjectId: string;
  category: AvosFactoryValidationRule["category"];
  severity: AvosFactoryValidationSeverity;
  status: AvosFactoryValidationStatus;
  message: string;
  evidence: Record<string, unknown>;
  detectedAt: string;
  resolvedAt?: string;
  waivedBy?: string;
  waiverReason?: string;
}

export interface AvosFactoryValidationReport {
  id: string;
  subjectId: string;
  actor: string;
  score: number;
  passed: boolean;
  findings: AvosFactoryValidationFinding[];
  blockingFindings: number;
  warningFindings: number;
  passedRules: number;
  failedRules: number;
  generatedAt: string;
}

export interface AvosFactoryQualityGate {
  id: string;
  subjectId: string;
  reportId: string;
  minimumScore: number;
  actualScore: number;
  blockingFindings: number;
  status: AvosFactoryQualityGateStatus;
  humanApproved: boolean;
  approvedBy?: string;
  decisionReason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface AvosFactoryDefectRecord {
  id: string;
  subjectId: string;
  findingId: string;
  title: string;
  severity: AvosFactoryValidationSeverity;
  status: "open" | "in-progress" | "resolved" | "accepted-risk";
  owner?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AvosFactoryComplianceSummary {
  subjectId: string;
  ruleCount: number;
  passedRules: number;
  failedRules: number;
  waivedRules: number;
  complianceScore: number;
  productionReady: boolean;
  generatedAt: string;
}

export interface AvosFactoryValidationSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  generatedAt: string;
}
