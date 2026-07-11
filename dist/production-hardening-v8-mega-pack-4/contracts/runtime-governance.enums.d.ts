export declare enum GovernanceEnvironment {
    DEVELOPMENT = "development",
    TEST = "test",
    STAGING = "staging",
    PRODUCTION = "production"
}
export declare enum GovernanceControlMode {
    OBSERVE = "observe",
    ADVISORY = "advisory",
    ENFORCE = "enforce",
    LOCKDOWN = "lockdown"
}
export declare enum GovernanceDecision {
    ALLOW = "allow",
    ALLOW_WITH_MONITORING = "allow_with_monitoring",
    REQUIRE_APPROVAL = "require_approval",
    DEFER = "defer",
    BLOCK = "block",
    EMERGENCY_ONLY = "emergency_only"
}
export declare enum GovernanceRiskLevel {
    INFORMATIONAL = "informational",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum ChangeWindowStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    OPEN = "open",
    CLOSED = "closed",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum ChangeWindowType {
    STANDARD = "standard",
    RESTRICTED = "restricted",
    EMERGENCY = "emergency",
    FREEZE = "freeze",
    MAINTENANCE = "maintenance"
}
export declare enum MaintenanceModeStatus {
    INACTIVE = "inactive",
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum GovernanceRequestStatus {
    PENDING = "pending",
    EVALUATING = "evaluating",
    APPROVED = "approved",
    REJECTED = "rejected",
    DEFERRED = "deferred",
    CANCELLED = "cancelled",
    EXECUTED = "executed",
    FAILED = "failed"
}
export declare enum GovernanceRequestType {
    CONFIGURATION_CHANGE = "configuration_change",
    DEPLOYMENT = "deployment",
    DATABASE_CHANGE = "database_change",
    FEATURE_RELEASE = "feature_release",
    SECURITY_CHANGE = "security_change",
    INFRASTRUCTURE_CHANGE = "infrastructure_change",
    INTEGRATION_CHANGE = "integration_change",
    EMERGENCY_CHANGE = "emergency_change",
    MAINTENANCE_OPERATION = "maintenance_operation",
    SERVICE_ISOLATION = "service_isolation",
    CAPACITY_CHANGE = "capacity_change",
    POLICY_CHANGE = "policy_change"
}
export declare enum GovernanceApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare enum GovernanceRecommendationType {
    APPROVE = "approve",
    REJECT = "reject",
    DEFER = "defer",
    REQUIRE_TESTING = "require_testing",
    REQUIRE_ROLLBACK_PLAN = "require_rollback_plan",
    REQUIRE_MONITORING = "require_monitoring",
    REQUIRE_MAINTENANCE_WINDOW = "require_maintenance_window",
    REDUCE_BLAST_RADIUS = "reduce_blast_radius",
    ESCALATE = "escalate"
}
export declare enum DependencyNodeType {
    SERVICE = "service",
    DATABASE = "database",
    CACHE = "cache",
    QUEUE = "queue",
    STORAGE = "storage",
    API = "api",
    EXTERNAL_PROVIDER = "external_provider",
    INFRASTRUCTURE = "infrastructure",
    WORKFLOW = "workflow"
}
export declare enum DependencyHealthStatus {
    HEALTHY = "healthy",
    DEGRADED = "degraded",
    UNHEALTHY = "unhealthy",
    UNAVAILABLE = "unavailable",
    UNKNOWN = "unknown"
}
export declare enum DependencyRelationshipType {
    HARD = "hard",
    SOFT = "soft",
    OPTIONAL = "optional",
    FALLBACK = "fallback",
    REPLICATION = "replication"
}
export declare enum CascadingFailureRisk {
    NONE = "none",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum SloComplianceStatus {
    COMPLIANT = "compliant",
    AT_RISK = "at_risk",
    BREACHED = "breached",
    UNKNOWN = "unknown"
}
export declare enum GovernanceAuditEventType {
    CONTROL_MODE_CHANGED = "control_mode_changed",
    CHANGE_WINDOW_CREATED = "change_window_created",
    CHANGE_WINDOW_UPDATED = "change_window_updated",
    MAINTENANCE_MODE_CREATED = "maintenance_mode_created",
    MAINTENANCE_MODE_UPDATED = "maintenance_mode_updated",
    GOVERNANCE_REQUEST_CREATED = "governance_request_created",
    GOVERNANCE_REQUEST_EVALUATED = "governance_request_evaluated",
    APPROVAL_RECORDED = "approval_recorded",
    RECOMMENDATION_CREATED = "recommendation_created",
    DEPENDENCY_REGISTERED = "dependency_registered",
    DEPENDENCY_HEALTH_UPDATED = "dependency_health_updated",
    CASCADE_ANALYZED = "cascade_analyzed",
    SLO_REGISTERED = "slo_registered",
    SLO_EVALUATED = "slo_evaluated",
    INTEGRITY_VERIFIED = "integrity_verified"
}
export declare enum GovernanceSimulationStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare enum GovernanceImpactCategory {
    SERVICE = "service",
    DEPENDENCY = "dependency",
    DATA = "data",
    SECURITY = "security",
    COMPLIANCE = "compliance",
    PERFORMANCE = "performance",
    AVAILABILITY = "availability",
    BUSINESS = "business"
}
export declare enum GovernanceApprovalTier {
    NONE = "none",
    STANDARD = "standard",
    ELEVATED = "elevated",
    SENIOR = "senior",
    EXECUTIVE = "executive",
    EMERGENCY = "emergency"
}
export declare enum RecoveryPlanStatus {
    DRAFT = "draft",
    READY = "ready",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    EXECUTING = "executing",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    ROLLED_BACK = "rolled_back"
}
export declare enum RecoveryActionType {
    RESTART_SERVICE = "restart_service",
    ISOLATE_SERVICE = "isolate_service",
    SWITCH_DEPENDENCY = "switch_dependency",
    ENABLE_FALLBACK = "enable_fallback",
    THROTTLE_TRAFFIC = "throttle_traffic",
    SCALE_OUT = "scale_out",
    SCALE_IN = "scale_in",
    PAUSE_JOBS = "pause_jobs",
    RESUME_JOBS = "resume_jobs",
    RESTORE_CONFIGURATION = "restore_configuration",
    RESTORE_BASELINE = "restore_baseline",
    CLEAR_CACHE = "clear_cache",
    DRAIN_NODE = "drain_node",
    CUSTOM = "custom"
}
export declare enum RecoveryActionStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    SKIPPED = "skipped",
    CANCELLED = "cancelled",
    ROLLED_BACK = "rolled_back"
}
export declare enum IsolationStrategy {
    NONE = "none",
    LOGICAL = "logical",
    NETWORK = "network",
    TRAFFIC = "traffic",
    DEPENDENCY = "dependency",
    FULL = "full"
}
export declare enum IsolationPlanStatus {
    DRAFT = "draft",
    READY = "ready",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare enum CapacityMetricType {
    CPU = "cpu",
    MEMORY = "memory",
    DISK = "disk",
    NETWORK = "network",
    REQUEST_RATE = "request_rate",
    QUEUE_DEPTH = "queue_depth",
    CONNECTIONS = "connections",
    LATENCY = "latency",
    CUSTOM = "custom"
}
export declare enum CapacityPolicyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export declare enum CapacityDecision {
    NO_ACTION = "no_action",
    SCALE_OUT = "scale_out",
    SCALE_IN = "scale_in",
    THROTTLE = "throttle",
    ALERT = "alert",
    BLOCK_CHANGE = "block_change"
}
export declare enum CapacityEvaluationStatus {
    HEALTHY = "healthy",
    WARNING = "warning",
    CRITICAL = "critical",
    UNKNOWN = "unknown"
}
export declare enum RuntimeDecisionRecordStatus {
    DRAFT = "draft",
    GENERATED = "generated",
    PENDING_REVIEW = "pending_review",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    OVERRIDDEN = "overridden",
    EXPIRED = "expired",
    EXECUTED = "executed"
}
export declare enum RuntimeDecisionSource {
    POLICY = "policy",
    RISK_ENGINE = "risk_engine",
    APPROVAL_MATRIX = "approval_matrix",
    IMPACT_ANALYSIS = "impact_analysis",
    SIMULATION = "simulation",
    CAPACITY = "capacity",
    DEPENDENCY = "dependency",
    SLO = "slo",
    HUMAN = "human",
    COMPOSITE = "composite"
}
export declare enum RuntimeDecisionConfidence {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high"
}
export declare enum ApprovalSuggestionDecision {
    AUTO_APPROVE = "auto_approve",
    RECOMMEND_APPROVAL = "recommend_approval",
    REQUIRE_MANUAL_REVIEW = "require_manual_review",
    RECOMMEND_REJECTION = "recommend_rejection",
    AUTO_REJECT = "auto_reject",
    DEFER = "defer"
}
export declare enum GuardrailType {
    RISK_LIMIT = "risk_limit",
    BLAST_RADIUS_LIMIT = "blast_radius_limit",
    TEST_COVERAGE_MINIMUM = "test_coverage_minimum",
    ROLLBACK_REQUIRED = "rollback_required",
    CHANGE_WINDOW_REQUIRED = "change_window_required",
    MAINTENANCE_REQUIRED = "maintenance_required",
    CAPACITY_HEALTH_REQUIRED = "capacity_health_required",
    DEPENDENCY_HEALTH_REQUIRED = "dependency_health_required",
    SLO_COMPLIANCE_REQUIRED = "slo_compliance_required",
    APPROVAL_ROLE_REQUIRED = "approval_role_required",
    CONCURRENT_CHANGE_LIMIT = "concurrent_change_limit",
    CUSTOM = "custom"
}
export declare enum GuardrailStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export declare enum GuardrailEvaluationResult {
    PASSED = "passed",
    WARNING = "warning",
    FAILED = "failed",
    SKIPPED = "skipped",
    UNKNOWN = "unknown"
}
export declare enum RuntimeRunbookStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export declare enum RuntimeRunbookStepType {
    VALIDATE = "validate",
    NOTIFY = "notify",
    APPROVAL_GATE = "approval_gate",
    EXECUTE_CHANGE = "execute_change",
    WAIT = "wait",
    HEALTH_CHECK = "health_check",
    SLO_CHECK = "slo_check",
    CAPACITY_CHECK = "capacity_check",
    DEPENDENCY_CHECK = "dependency_check",
    ISOLATE = "isolate",
    RECOVER = "recover",
    ROLLBACK = "rollback",
    CUSTOM = "custom"
}
export declare enum RuntimeRunbookExecutionStatus {
    PENDING = "pending",
    RUNNING = "running",
    PAUSED = "paused",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    ROLLING_BACK = "rolling_back",
    ROLLED_BACK = "rolled_back"
}
export declare enum RuntimeRunbookStepStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    SKIPPED = "skipped",
    CANCELLED = "cancelled",
    ROLLED_BACK = "rolled_back"
}
export declare enum RuntimeChangeExecutionStatus {
    CREATED = "created",
    VALIDATING = "validating",
    BLOCKED = "blocked",
    PENDING_APPROVAL = "pending_approval",
    READY = "ready",
    EXECUTING = "executing",
    VERIFYING = "verifying",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    ROLLING_BACK = "rolling_back",
    ROLLED_BACK = "rolled_back",
    CANCELLED = "cancelled"
}
export declare enum RuntimeLockType {
    GLOBAL = "global",
    ENVIRONMENT = "environment",
    NAMESPACE = "namespace",
    SERVICE = "service",
    RESOURCE = "resource",
    CHANGE = "change"
}
export declare enum RuntimeLockStatus {
    ACTIVE = "active",
    RELEASED = "released",
    EXPIRED = "expired",
    FORCE_RELEASED = "force_released"
}
export declare enum RuntimeExecutionEvidenceType {
    EXECUTION_CREATED = "execution_created",
    VALIDATION_STARTED = "validation_started",
    VALIDATION_COMPLETED = "validation_completed",
    LOCK_ACQUIRED = "lock_acquired",
    LOCK_RELEASED = "lock_released",
    STEP_STARTED = "step_started",
    STEP_COMPLETED = "step_completed",
    STEP_FAILED = "step_failed",
    EXECUTION_SUCCEEDED = "execution_succeeded",
    EXECUTION_FAILED = "execution_failed",
    ROLLBACK_STARTED = "rollback_started",
    ROLLBACK_COMPLETED = "rollback_completed",
    EXECUTION_CANCELLED = "execution_cancelled"
}
export declare enum GovernanceScheduleStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum GovernanceScheduleType {
    CHANGE_WINDOW_OPEN = "change_window_open",
    CHANGE_WINDOW_CLOSE = "change_window_close",
    MAINTENANCE_ACTIVATE = "maintenance_activate",
    MAINTENANCE_COMPLETE = "maintenance_complete",
    REQUEST_REEVALUATION = "request_reevaluation",
    DECISION_EXPIRY = "decision_expiry",
    LOCK_EXPIRY = "lock_expiry",
    RUNBOOK_EXECUTION = "runbook_execution",
    CHANGE_EXECUTION = "change_execution",
    SLO_EVALUATION = "slo_evaluation",
    CAPACITY_EVALUATION = "capacity_evaluation",
    DEPENDENCY_HEALTH_CHECK = "dependency_health_check",
    EVIDENCE_VERIFICATION = "evidence_verification",
    CUSTOM = "custom"
}
export declare enum GovernanceScheduleRunStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    SKIPPED = "skipped",
    CANCELLED = "cancelled"
}
export declare enum GovernanceEscalationStatus {
    OPEN = "open",
    ACKNOWLEDGED = "acknowledged",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum GovernanceEscalationSeverity {
    INFORMATIONAL = "informational",
    WARNING = "warning",
    HIGH = "high",
    CRITICAL = "critical",
    EMERGENCY = "emergency"
}
export declare enum GovernanceEscalationReason {
    APPROVAL_TIMEOUT = "approval_timeout",
    DECISION_TIMEOUT = "decision_timeout",
    EXECUTION_FAILURE = "execution_failure",
    RUNBOOK_FAILURE = "runbook_failure",
    RECOVERY_FAILURE = "recovery_failure",
    LOCK_CONFLICT = "lock_conflict",
    GUARDRAIL_FAILURE = "guardrail_failure",
    SLO_BREACH = "slo_breach",
    CAPACITY_CRITICAL = "capacity_critical",
    DEPENDENCY_UNHEALTHY = "dependency_unhealthy",
    CASCADE_RISK = "cascade_risk",
    AUDIT_INTEGRITY_FAILURE = "audit_integrity_failure",
    MANUAL = "manual",
    CUSTOM = "custom"
}
export declare enum GovernanceNotificationChannel {
    INTERNAL = "internal",
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    WEBHOOK = "webhook",
    SLACK = "slack",
    TEAMS = "teams",
    PAGER = "pager",
    CUSTOM = "custom"
}
export declare enum GovernanceNotificationStatus {
    PENDING = "pending",
    QUEUED = "queued",
    SENT = "sent",
    DELIVERED = "delivered",
    FAILED = "failed",
    CANCELLED = "cancelled",
    SUPPRESSED = "suppressed"
}
export declare enum GovernanceTimelineEventType {
    REQUEST_CREATED = "request_created",
    REQUEST_EVALUATED = "request_evaluated",
    APPROVAL_RECORDED = "approval_recorded",
    DECISION_GENERATED = "decision_generated",
    DECISION_REVIEWED = "decision_reviewed",
    CHANGE_EXECUTION_CREATED = "change_execution_created",
    CHANGE_EXECUTION_STARTED = "change_execution_started",
    CHANGE_EXECUTION_COMPLETED = "change_execution_completed",
    CHANGE_EXECUTION_FAILED = "change_execution_failed",
    RUNBOOK_STARTED = "runbook_started",
    RUNBOOK_COMPLETED = "runbook_completed",
    RUNBOOK_FAILED = "runbook_failed",
    RECOVERY_STARTED = "recovery_started",
    RECOVERY_COMPLETED = "recovery_completed",
    RECOVERY_FAILED = "recovery_failed",
    ESCALATION_CREATED = "escalation_created",
    ESCALATION_UPDATED = "escalation_updated",
    NOTIFICATION_SENT = "notification_sent",
    SCHEDULE_EXECUTED = "schedule_executed",
    CUSTOM = "custom"
}
export declare enum GovernanceCheckpointStatus {
    CREATED = "created",
    VERIFIED = "verified",
    INVALID = "invalid",
    RESTORE_READY = "restore_ready",
    RESTORED = "restored",
    ARCHIVED = "archived",
    EXPIRED = "expired",
    DELETED = "deleted"
}
export declare enum GovernanceCheckpointType {
    MANUAL = "manual",
    PRE_CHANGE = "pre_change",
    POST_CHANGE = "post_change",
    PRE_RECOVERY = "pre_recovery",
    POST_RECOVERY = "post_recovery",
    SCHEDULED = "scheduled",
    BASELINE = "baseline",
    EMERGENCY = "emergency"
}
export declare enum GovernanceSnapshotScope {
    FULL = "full",
    GOVERNANCE = "governance",
    REQUESTS = "requests",
    DECISIONS = "decisions",
    DEPENDENCIES = "dependencies",
    SLO = "slo",
    EXECUTIONS = "executions",
    OPERATIONS = "operations",
    SECURITY = "security",
    CUSTOM = "custom"
}
export declare enum GovernanceRetentionStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    DISABLED = "disabled",
    ARCHIVED = "archived"
}
export declare enum GovernanceRetentionAction {
    RETAIN = "retain",
    ARCHIVE = "archive",
    COMPRESS = "compress",
    REDACT = "redact",
    DELETE = "delete",
    LEGAL_HOLD = "legal_hold"
}
export declare enum GovernanceArchiveStatus {
    PENDING = "pending",
    CREATING = "creating",
    READY = "ready",
    VERIFIED = "verified",
    FAILED = "failed",
    RESTORED = "restored",
    EXPIRED = "expired",
    DELETED = "deleted"
}
export declare enum GovernanceArchiveType {
    CHECKPOINT = "checkpoint",
    AUDIT = "audit",
    EXECUTION_EVIDENCE = "execution_evidence",
    TIMELINE = "timeline",
    REQUEST_HISTORY = "request_history",
    DECISION_HISTORY = "decision_history",
    OPERATIONS = "operations",
    FULL_EXPORT = "full_export"
}
export declare enum GovernanceRestoreStatus {
    DRAFT = "draft",
    VALIDATING = "validating",
    READY = "ready",
    BLOCKED = "blocked",
    EXECUTING = "executing",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum GovernanceDataClassification {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    RESTRICTED = "restricted",
    SECRET = "secret"
}
