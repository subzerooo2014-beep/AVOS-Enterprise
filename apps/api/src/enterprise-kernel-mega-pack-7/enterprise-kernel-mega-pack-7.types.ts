export type KernelLogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export type KernelMetricType =
  | "counter"
  | "gauge"
  | "histogram";

export type KernelTraceStatus =
  | "running"
  | "completed"
  | "failed"
  | "blocked";

export type KernelRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type MetaKernelDecision =
  | "allow"
  | "allow-with-conditions"
  | "hold"
  | "reject";

export type KernelCertificationStatus =
  | "pending"
  | "certified"
  | "conditional"
  | "revoked";

export interface KernelStructuredLog {
  id: string;
  level: KernelLogLevel;
  source: string;
  message: string;
  correlationId: string;
  traceId?: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export interface KernelMetricRecord {
  id: string;
  name: string;
  type: KernelMetricType;
  value: number;
  labels: Record<string, string>;
  recordedAt: string;
}

export interface KernelTraceSpan {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  source: string;
  status: KernelTraceStatus;
  correlationId: string;
  attributes: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface KernelRuntimeTimelineEntry {
  id: string;
  category:
    | "runtime"
    | "lifecycle"
    | "security"
    | "health"
    | "orchestration"
    | "plugin"
    | "meta-kernel"
    | "certification";
  event: string;
  subjectId: string;
  status: string;
  correlationId: string;
  traceId?: string;
  details: Record<string, unknown>;
  occurredAt: string;
}

export interface KernelOperationalEvidence {
  id: string;
  category: string;
  subjectId: string;
  outcome: "passed" | "failed" | "warning";
  details: Record<string, unknown>;
  correlationId: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface LivingKernelObservation {
  id: string;
  category:
    | "performance"
    | "stability"
    | "security"
    | "dependency"
    | "configuration"
    | "orchestration"
    | "plugin"
    | "architecture";
  source: string;
  signal: string;
  score: number;
  severity: "info" | "warning" | "error" | "critical";
  details: Record<string, unknown>;
  observedAt: string;
}

export interface LivingKernelPattern {
  id: string;
  name: string;
  category: string;
  observationIds: string[];
  confidence: number;
  impact: "low" | "medium" | "high" | "critical";
  explanation: string;
  detectedAt: string;
}

export interface LivingKernelRecommendation {
  id: string;
  title: string;
  description: string;
  priority: KernelRecommendationPriority;
  sourcePatternIds: string[];
  proposedActions: string[];
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  status:
    | "proposed"
    | "approved"
    | "rejected"
    | "implemented";
  createdAt: string;
  updatedAt: string;
}

export interface MetaKernelArchitectureRule {
  id: string;
  name: string;
  description: string;
  category:
    | "compatibility"
    | "upgrade"
    | "rollback"
    | "dependency"
    | "security"
    | "observability"
    | "governance";
  mandatory: boolean;
  active: boolean;
  checks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MetaKernelAssessment {
  id: string;
  subjectId: string;
  decision: MetaKernelDecision;
  score: number;
  passedRuleIds: string[];
  failedRuleIds: string[];
  conditions: string[];
  findings: string[];
  correlationId: string;
  assessedAt: string;
}

export interface MetaKernelUpgradePlan {
  id: string;
  subjectId: string;
  fromVersion: string;
  toVersion: string;
  steps: string[];
  rollbackSteps: string[];
  compatibilityAssessmentId: string;
  requiresHumanApproval: boolean;
  approvedByIdentityId?: string;
  status:
    | "draft"
    | "approved"
    | "running"
    | "completed"
    | "rolled-back"
    | "failed";
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KernelPackRecord {
  id: string;
  packNumber: number;
  name: string;
  route: string;
  version: string;
  registered: boolean;
  verified: boolean;
  buildPassed: boolean;
  healthy: boolean;
  required: boolean;
  metadata: Record<string, unknown>;
}

export interface KernelCrossValidationReport {
  id: string;
  success: boolean;
  score: number;
  packsChecked: number;
  checks: Record<string, boolean>;
  criticalFailures: string[];
  warnings: string[];
  correlationId: string;
  createdAt: string;
}

export interface KernelFinalCertification {
  id: string;
  validationReportId: string;
  status: KernelCertificationStatus;
  score: number;
  certifiedByIdentityId: string;
  approvedByIdentityId: string;
  reasons: string[];
  conditions: string[];
  correlationId: string;
  createdAt: string;
}

export interface KernelFinalSmokeTest {
  id: string;
  stage: "started" | "completed" | "failed";
  passed: number;
  failed: number;
  score: number;
  runtimeReady: boolean;
  checks: Record<string, boolean>;
  correlationId: string;
  createdAt: string;
}

export interface KernelReleaseDecision {
  id: string;
  decision:
    | "release-enterprise-kernel"
    | "conditional-release"
    | "hold-enterprise-kernel";
  certificationId?: string;
  smokeTestId?: string;
  score: number;
  reasons: string[];
  conditions: string[];
  decidedByIdentityId: string;
  approvedByIdentityId: string;
  correlationId: string;
  createdAt: string;
}

export interface EnterpriseKernelFinalHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    observabilityScore: number;
    livingKernelScore: number;
    metaKernelScore: number;
    validationScore: number;
    certificationScore: number;
    smokeScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface EnterpriseKernelFinalAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "observability"
    | "living-kernel"
    | "meta-kernel"
    | "validation"
    | "certification"
    | "smoke"
    | "release"
    | "health"
    | "evidence";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
