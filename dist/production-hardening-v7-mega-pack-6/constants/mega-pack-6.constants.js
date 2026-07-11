"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_CODE_PREFIX = exports.EXECUTION_CODE_PREFIX = exports.WORKFLOW_CODE_PREFIX = exports.TREATMENT_CODE_PREFIX = exports.BASELINE_CODE_PREFIX = exports.APPROVAL_CODE_PREFIX = exports.INCIDENT_CODE_PREFIX = exports.DEFAULT_APPROVAL_EXPIRY_HOURS = exports.MEGA_PACK_6_SYSTEM = exports.MEGA_PACK_6_COLLECTIONS = void 0;
exports.MEGA_PACK_6_COLLECTIONS = {
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
};
exports.MEGA_PACK_6_SYSTEM = {
    name: "AVOS Production Hardening V7 — Mega Pack 6",
    version: "v7-mega-pack-6",
    module: "Enterprise Operational Resilience Orchestration",
};
exports.DEFAULT_APPROVAL_EXPIRY_HOURS = 72;
exports.INCIDENT_CODE_PREFIX = "AVOS-INC";
exports.APPROVAL_CODE_PREFIX = "AVOS-APR";
exports.BASELINE_CODE_PREFIX = "AVOS-BSL";
exports.TREATMENT_CODE_PREFIX = "AVOS-TRT";
exports.WORKFLOW_CODE_PREFIX = "AVOS-WFL";
exports.EXECUTION_CODE_PREFIX = "AVOS-EXE";
exports.EVENT_CODE_PREFIX = "AVOS-EVT";
//# sourceMappingURL=mega-pack-6.constants.js.map