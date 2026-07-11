export const MEGA_PACK_6_COLLECTIONS = {
  complianceBaselines: "compliance-baselines",
  baselineComparisons: "baseline-comparisons",
  approvalRequests: "approval-requests",
  enterpriseIncidents: "enterprise-incidents",
  riskTreatmentPlans: "risk-treatment-plans",
  workflowDefinitions: "workflow-definitions",
  workflowExecutions: "workflow-executions",
  platformEvents: "platform-events",
  idempotencyRecords: "idempotency-records",
  automatedRemediations: "automated-remediations",
  evidenceChain: "evidence-chain",
  controlSchedules: "control-schedules",
  schedulerRuns: "scheduler-runs",
} as const;

export const MEGA_PACK_6_SYSTEM = {
  name: "AVOS Production Hardening V7 — Mega Pack 6",
  version: "v7-mega-pack-6",
  module: "Enterprise Operational Resilience Orchestration",
} as const;

export const DEFAULT_APPROVAL_EXPIRY_HOURS = 72;

export const INCIDENT_CODE_PREFIX = "AVOS-INC";
export const APPROVAL_CODE_PREFIX = "AVOS-APR";
export const BASELINE_CODE_PREFIX = "AVOS-BSL";
export const TREATMENT_CODE_PREFIX = "AVOS-TRT";
export const WORKFLOW_CODE_PREFIX = "AVOS-WFL";
export const EXECUTION_CODE_PREFIX = "AVOS-EXE";
export const EVENT_CODE_PREFIX = "AVOS-EVT";
