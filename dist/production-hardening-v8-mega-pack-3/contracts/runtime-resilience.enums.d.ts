export declare enum RuntimeEnvironment {
    DEVELOPMENT = "development",
    TEST = "test",
    STAGING = "staging",
    PRODUCTION = "production"
}
export declare enum ResilienceConfigurationStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    ACTIVE = "active",
    SUPERSEDED = "superseded",
    REJECTED = "rejected",
    ROLLED_BACK = "rolled_back",
    ARCHIVED = "archived"
}
export declare enum ResiliencePolicyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export declare enum RuntimeRiskLevel {
    INFORMATIONAL = "informational",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum RuntimeDecision {
    ALLOW = "allow",
    ALLOW_WITH_MONITORING = "allow_with_monitoring",
    REQUIRE_APPROVAL = "require_approval",
    BLOCK = "block",
    EMERGENCY_ROLLBACK = "emergency_rollback"
}
export declare enum RuntimeChangeType {
    CONFIGURATION = "configuration",
    FEATURE_FLAG = "feature_flag",
    DEPLOYMENT = "deployment",
    DATABASE = "database",
    SECURITY = "security",
    INFRASTRUCTURE = "infrastructure",
    INTEGRATION = "integration",
    POLICY = "policy",
    EMERGENCY = "emergency"
}
export declare enum RuntimeControlMode {
    OBSERVE = "observe",
    ADVISORY = "advisory",
    ENFORCE = "enforce",
    LOCKDOWN = "lockdown"
}
export declare enum RuntimeSignalType {
    HEALTH = "health",
    LATENCY = "latency",
    ERROR_RATE = "error_rate",
    THROUGHPUT = "throughput",
    SATURATION = "saturation",
    SECURITY = "security",
    COMPLIANCE = "compliance",
    AVAILABILITY = "availability",
    DATA_INTEGRITY = "data_integrity",
    BUSINESS = "business"
}
export declare enum RuntimeSignalStatus {
    HEALTHY = "healthy",
    DEGRADED = "degraded",
    UNHEALTHY = "unhealthy",
    UNKNOWN = "unknown"
}
export declare enum RuntimeIncidentStatus {
    OPEN = "open",
    INVESTIGATING = "investigating",
    MITIGATING = "mitigating",
    MONITORING = "monitoring",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare enum RuntimeIncidentSeverity {
    SEV5 = "sev5",
    SEV4 = "sev4",
    SEV3 = "sev3",
    SEV2 = "sev2",
    SEV1 = "sev1"
}
export declare enum ResilienceActionType {
    NOTIFY = "notify",
    THROTTLE = "throttle",
    ISOLATE = "isolate",
    DISABLE_FEATURE = "disable_feature",
    PAUSE_WORKFLOW = "pause_workflow",
    SWITCH_DEPENDENCY = "switch_dependency",
    SCALE_OUT = "scale_out",
    SCALE_IN = "scale_in",
    ROLLBACK = "rollback",
    RESTORE_BASELINE = "restore_baseline",
    LOCKDOWN = "lockdown",
    CUSTOM = "custom"
}
export declare enum ResilienceActionStatus {
    PLANNED = "planned",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    ROLLED_BACK = "rolled_back"
}
export declare enum ApprovalDecision {
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum EvidenceEntryType {
    CONFIGURATION_CREATED = "configuration_created",
    CONFIGURATION_SUBMITTED = "configuration_submitted",
    CONFIGURATION_APPROVED = "configuration_approved",
    CONFIGURATION_REJECTED = "configuration_rejected",
    CONFIGURATION_ACTIVATED = "configuration_activated",
    CONFIGURATION_ROLLED_BACK = "configuration_rolled_back",
    POLICY_CREATED = "policy_created",
    POLICY_ACTIVATED = "policy_activated",
    RISK_EVALUATED = "risk_evaluated",
    SIGNAL_RECORDED = "signal_recorded",
    INCIDENT_CREATED = "incident_created",
    INCIDENT_UPDATED = "incident_updated",
    ACTION_CREATED = "action_created",
    ACTION_EXECUTED = "action_executed",
    ACTION_FAILED = "action_failed",
    BASELINE_CAPTURED = "baseline_captured",
    INTEGRITY_VERIFIED = "integrity_verified",
    CONTROL_MODE_CHANGED = "control_mode_changed"
}
