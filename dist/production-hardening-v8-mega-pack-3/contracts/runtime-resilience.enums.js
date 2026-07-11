"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceEntryType = exports.ApprovalDecision = exports.ResilienceActionStatus = exports.ResilienceActionType = exports.RuntimeIncidentSeverity = exports.RuntimeIncidentStatus = exports.RuntimeSignalStatus = exports.RuntimeSignalType = exports.RuntimeControlMode = exports.RuntimeChangeType = exports.RuntimeDecision = exports.RuntimeRiskLevel = exports.ResiliencePolicyStatus = exports.ResilienceConfigurationStatus = exports.RuntimeEnvironment = void 0;
var RuntimeEnvironment;
(function (RuntimeEnvironment) {
    RuntimeEnvironment["DEVELOPMENT"] = "development";
    RuntimeEnvironment["TEST"] = "test";
    RuntimeEnvironment["STAGING"] = "staging";
    RuntimeEnvironment["PRODUCTION"] = "production";
})(RuntimeEnvironment || (exports.RuntimeEnvironment = RuntimeEnvironment = {}));
var ResilienceConfigurationStatus;
(function (ResilienceConfigurationStatus) {
    ResilienceConfigurationStatus["DRAFT"] = "draft";
    ResilienceConfigurationStatus["PENDING_APPROVAL"] = "pending_approval";
    ResilienceConfigurationStatus["APPROVED"] = "approved";
    ResilienceConfigurationStatus["ACTIVE"] = "active";
    ResilienceConfigurationStatus["SUPERSEDED"] = "superseded";
    ResilienceConfigurationStatus["REJECTED"] = "rejected";
    ResilienceConfigurationStatus["ROLLED_BACK"] = "rolled_back";
    ResilienceConfigurationStatus["ARCHIVED"] = "archived";
})(ResilienceConfigurationStatus || (exports.ResilienceConfigurationStatus = ResilienceConfigurationStatus = {}));
var ResiliencePolicyStatus;
(function (ResiliencePolicyStatus) {
    ResiliencePolicyStatus["DRAFT"] = "draft";
    ResiliencePolicyStatus["ACTIVE"] = "active";
    ResiliencePolicyStatus["DISABLED"] = "disabled";
    ResiliencePolicyStatus["ARCHIVED"] = "archived";
})(ResiliencePolicyStatus || (exports.ResiliencePolicyStatus = ResiliencePolicyStatus = {}));
var RuntimeRiskLevel;
(function (RuntimeRiskLevel) {
    RuntimeRiskLevel["INFORMATIONAL"] = "informational";
    RuntimeRiskLevel["LOW"] = "low";
    RuntimeRiskLevel["MEDIUM"] = "medium";
    RuntimeRiskLevel["HIGH"] = "high";
    RuntimeRiskLevel["CRITICAL"] = "critical";
})(RuntimeRiskLevel || (exports.RuntimeRiskLevel = RuntimeRiskLevel = {}));
var RuntimeDecision;
(function (RuntimeDecision) {
    RuntimeDecision["ALLOW"] = "allow";
    RuntimeDecision["ALLOW_WITH_MONITORING"] = "allow_with_monitoring";
    RuntimeDecision["REQUIRE_APPROVAL"] = "require_approval";
    RuntimeDecision["BLOCK"] = "block";
    RuntimeDecision["EMERGENCY_ROLLBACK"] = "emergency_rollback";
})(RuntimeDecision || (exports.RuntimeDecision = RuntimeDecision = {}));
var RuntimeChangeType;
(function (RuntimeChangeType) {
    RuntimeChangeType["CONFIGURATION"] = "configuration";
    RuntimeChangeType["FEATURE_FLAG"] = "feature_flag";
    RuntimeChangeType["DEPLOYMENT"] = "deployment";
    RuntimeChangeType["DATABASE"] = "database";
    RuntimeChangeType["SECURITY"] = "security";
    RuntimeChangeType["INFRASTRUCTURE"] = "infrastructure";
    RuntimeChangeType["INTEGRATION"] = "integration";
    RuntimeChangeType["POLICY"] = "policy";
    RuntimeChangeType["EMERGENCY"] = "emergency";
})(RuntimeChangeType || (exports.RuntimeChangeType = RuntimeChangeType = {}));
var RuntimeControlMode;
(function (RuntimeControlMode) {
    RuntimeControlMode["OBSERVE"] = "observe";
    RuntimeControlMode["ADVISORY"] = "advisory";
    RuntimeControlMode["ENFORCE"] = "enforce";
    RuntimeControlMode["LOCKDOWN"] = "lockdown";
})(RuntimeControlMode || (exports.RuntimeControlMode = RuntimeControlMode = {}));
var RuntimeSignalType;
(function (RuntimeSignalType) {
    RuntimeSignalType["HEALTH"] = "health";
    RuntimeSignalType["LATENCY"] = "latency";
    RuntimeSignalType["ERROR_RATE"] = "error_rate";
    RuntimeSignalType["THROUGHPUT"] = "throughput";
    RuntimeSignalType["SATURATION"] = "saturation";
    RuntimeSignalType["SECURITY"] = "security";
    RuntimeSignalType["COMPLIANCE"] = "compliance";
    RuntimeSignalType["AVAILABILITY"] = "availability";
    RuntimeSignalType["DATA_INTEGRITY"] = "data_integrity";
    RuntimeSignalType["BUSINESS"] = "business";
})(RuntimeSignalType || (exports.RuntimeSignalType = RuntimeSignalType = {}));
var RuntimeSignalStatus;
(function (RuntimeSignalStatus) {
    RuntimeSignalStatus["HEALTHY"] = "healthy";
    RuntimeSignalStatus["DEGRADED"] = "degraded";
    RuntimeSignalStatus["UNHEALTHY"] = "unhealthy";
    RuntimeSignalStatus["UNKNOWN"] = "unknown";
})(RuntimeSignalStatus || (exports.RuntimeSignalStatus = RuntimeSignalStatus = {}));
var RuntimeIncidentStatus;
(function (RuntimeIncidentStatus) {
    RuntimeIncidentStatus["OPEN"] = "open";
    RuntimeIncidentStatus["INVESTIGATING"] = "investigating";
    RuntimeIncidentStatus["MITIGATING"] = "mitigating";
    RuntimeIncidentStatus["MONITORING"] = "monitoring";
    RuntimeIncidentStatus["RESOLVED"] = "resolved";
    RuntimeIncidentStatus["CLOSED"] = "closed";
})(RuntimeIncidentStatus || (exports.RuntimeIncidentStatus = RuntimeIncidentStatus = {}));
var RuntimeIncidentSeverity;
(function (RuntimeIncidentSeverity) {
    RuntimeIncidentSeverity["SEV5"] = "sev5";
    RuntimeIncidentSeverity["SEV4"] = "sev4";
    RuntimeIncidentSeverity["SEV3"] = "sev3";
    RuntimeIncidentSeverity["SEV2"] = "sev2";
    RuntimeIncidentSeverity["SEV1"] = "sev1";
})(RuntimeIncidentSeverity || (exports.RuntimeIncidentSeverity = RuntimeIncidentSeverity = {}));
var ResilienceActionType;
(function (ResilienceActionType) {
    ResilienceActionType["NOTIFY"] = "notify";
    ResilienceActionType["THROTTLE"] = "throttle";
    ResilienceActionType["ISOLATE"] = "isolate";
    ResilienceActionType["DISABLE_FEATURE"] = "disable_feature";
    ResilienceActionType["PAUSE_WORKFLOW"] = "pause_workflow";
    ResilienceActionType["SWITCH_DEPENDENCY"] = "switch_dependency";
    ResilienceActionType["SCALE_OUT"] = "scale_out";
    ResilienceActionType["SCALE_IN"] = "scale_in";
    ResilienceActionType["ROLLBACK"] = "rollback";
    ResilienceActionType["RESTORE_BASELINE"] = "restore_baseline";
    ResilienceActionType["LOCKDOWN"] = "lockdown";
    ResilienceActionType["CUSTOM"] = "custom";
})(ResilienceActionType || (exports.ResilienceActionType = ResilienceActionType = {}));
var ResilienceActionStatus;
(function (ResilienceActionStatus) {
    ResilienceActionStatus["PLANNED"] = "planned";
    ResilienceActionStatus["PENDING_APPROVAL"] = "pending_approval";
    ResilienceActionStatus["APPROVED"] = "approved";
    ResilienceActionStatus["RUNNING"] = "running";
    ResilienceActionStatus["SUCCEEDED"] = "succeeded";
    ResilienceActionStatus["FAILED"] = "failed";
    ResilienceActionStatus["CANCELLED"] = "cancelled";
    ResilienceActionStatus["ROLLED_BACK"] = "rolled_back";
})(ResilienceActionStatus || (exports.ResilienceActionStatus = ResilienceActionStatus = {}));
var ApprovalDecision;
(function (ApprovalDecision) {
    ApprovalDecision["APPROVED"] = "approved";
    ApprovalDecision["REJECTED"] = "rejected";
})(ApprovalDecision || (exports.ApprovalDecision = ApprovalDecision = {}));
var EvidenceEntryType;
(function (EvidenceEntryType) {
    EvidenceEntryType["CONFIGURATION_CREATED"] = "configuration_created";
    EvidenceEntryType["CONFIGURATION_SUBMITTED"] = "configuration_submitted";
    EvidenceEntryType["CONFIGURATION_APPROVED"] = "configuration_approved";
    EvidenceEntryType["CONFIGURATION_REJECTED"] = "configuration_rejected";
    EvidenceEntryType["CONFIGURATION_ACTIVATED"] = "configuration_activated";
    EvidenceEntryType["CONFIGURATION_ROLLED_BACK"] = "configuration_rolled_back";
    EvidenceEntryType["POLICY_CREATED"] = "policy_created";
    EvidenceEntryType["POLICY_ACTIVATED"] = "policy_activated";
    EvidenceEntryType["RISK_EVALUATED"] = "risk_evaluated";
    EvidenceEntryType["SIGNAL_RECORDED"] = "signal_recorded";
    EvidenceEntryType["INCIDENT_CREATED"] = "incident_created";
    EvidenceEntryType["INCIDENT_UPDATED"] = "incident_updated";
    EvidenceEntryType["ACTION_CREATED"] = "action_created";
    EvidenceEntryType["ACTION_EXECUTED"] = "action_executed";
    EvidenceEntryType["ACTION_FAILED"] = "action_failed";
    EvidenceEntryType["BASELINE_CAPTURED"] = "baseline_captured";
    EvidenceEntryType["INTEGRITY_VERIFIED"] = "integrity_verified";
    EvidenceEntryType["CONTROL_MODE_CHANGED"] = "control_mode_changed";
})(EvidenceEntryType || (exports.EvidenceEntryType = EvidenceEntryType = {}));
//# sourceMappingURL=runtime-resilience.enums.js.map