export type EnterpriseSeverity = "informational" | "low" | "medium" | "high" | "critical";
export type OperationalStatus = "planned" | "pending" | "active" | "paused" | "blocked" | "completed" | "cancelled" | "failed";
export type ApprovalDecision = "pending" | "approved" | "rejected" | "expired" | "cancelled";
export type IncidentStatus = "detected" | "triaged" | "declared" | "contained" | "recovering" | "resolved" | "closed";
export type IncidentCommandRole = "incident_commander" | "security_lead" | "operations_lead" | "communications_lead" | "compliance_lead" | "recovery_lead" | "observer";
export type BaselineStatus = "draft" | "pending_approval" | "approved" | "active" | "superseded" | "retired";
export type BaselineComparisonStatus = "compliant" | "drift_detected" | "unknown" | "error";
export type WorkflowExecutionStatus = "queued" | "running" | "waiting_approval" | "waiting_dependency" | "completed" | "failed" | "cancelled";
export type RiskTreatmentStrategy = "avoid" | "mitigate" | "transfer" | "accept" | "monitor";
export type RiskTreatmentStatus = "draft" | "pending_approval" | "approved" | "executing" | "completed" | "rejected" | "cancelled";
export interface PersistentEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}
export interface EntityReference {
    entityType: string;
    entityId: string;
}
export interface ComplianceBaseline extends PersistentEntity {
    baselineCode: string;
    name: string;
    description: string;
    domain: string;
    version: number;
    status: BaselineStatus;
    owner: string;
    effectiveFrom?: string;
    effectiveUntil?: string;
    approvedBy?: string;
    approvedAt?: string;
    supersedesBaselineId?: string;
    controls: BaselineControl[];
    metadata: Record<string, unknown>;
}
export interface BaselineControl {
    id: string;
    controlCode: string;
    name: string;
    description: string;
    severity: EnterpriseSeverity;
    comparisonType: "equals" | "not_equals" | "contains" | "exists" | "not_exists" | "greater_than" | "less_than" | "custom";
    expectedValue?: unknown;
    resourcePath: string;
    enabled: boolean;
    metadata: Record<string, unknown>;
}
export interface BaselineComparison extends PersistentEntity {
    baselineId: string;
    baselineCode: string;
    baselineVersion: number;
    targetType: string;
    targetId: string;
    status: BaselineComparisonStatus;
    score: number;
    startedAt: string;
    completedAt: string;
    results: BaselineControlResult[];
    fingerprint: string;
    errorMessage?: string;
}
export interface BaselineControlResult {
    controlId: string;
    controlCode: string;
    status: "passed" | "failed" | "warning" | "error";
    severity: EnterpriseSeverity;
    expectedValue?: unknown;
    observedValue?: unknown;
    message: string;
}
export interface ApprovalRequest extends PersistentEntity {
    requestCode: string;
    title: string;
    description: string;
    requestType: string;
    requestedBy: string;
    requiredApprovers: string[];
    minimumApprovals: number;
    approvals: ApprovalVote[];
    decision: ApprovalDecision;
    expiresAt?: string;
    decidedAt?: string;
    entityReference: EntityReference;
    metadata: Record<string, unknown>;
}
export interface ApprovalVote {
    id: string;
    approver: string;
    decision: "approved" | "rejected";
    comment?: string;
    decidedAt: string;
}
export interface EnterpriseIncident extends PersistentEntity {
    incidentCode: string;
    title: string;
    description: string;
    severity: EnterpriseSeverity;
    status: IncidentStatus;
    source: string;
    detectedAt: string;
    declaredAt?: string;
    containedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    commander?: string;
    commandTeam: IncidentCommandMember[];
    affectedServices: string[];
    businessImpact: string;
    technicalImpact: string;
    regulatoryImpact?: string;
    evidenceReferences: string[];
    timeline: IncidentTimelineEntry[];
    actions: IncidentAction[];
    metadata: Record<string, unknown>;
}
export interface IncidentCommandMember {
    id: string;
    person: string;
    role: IncidentCommandRole;
    assignedAt: string;
    active: boolean;
}
export interface IncidentTimelineEntry {
    id: string;
    timestamp: string;
    eventType: string;
    description: string;
    actor: string;
    metadata: Record<string, unknown>;
}
export interface IncidentAction {
    id: string;
    title: string;
    description: string;
    owner: string;
    status: OperationalStatus;
    priority: number;
    dueAt?: string;
    completedAt?: string;
    dependencies: string[];
    evidenceReferences: string[];
}
export interface RiskTreatmentPlan extends PersistentEntity {
    treatmentCode: string;
    riskId: string;
    riskCode?: string;
    title: string;
    description: string;
    strategy: RiskTreatmentStrategy;
    status: RiskTreatmentStatus;
    owner: string;
    targetResidualScore: number;
    approvalRequestId?: string;
    startedAt?: string;
    completedAt?: string;
    tasks: RiskTreatmentTask[];
    metadata: Record<string, unknown>;
}
export interface RiskTreatmentTask {
    id: string;
    title: string;
    description: string;
    owner: string;
    status: OperationalStatus;
    priority: number;
    dueAt?: string;
    completedAt?: string;
    dependencies: string[];
    output?: Record<string, unknown>;
}
export interface WorkflowDefinition extends PersistentEntity {
    workflowCode: string;
    name: string;
    description: string;
    version: number;
    enabled: boolean;
    triggerType: string;
    steps: WorkflowStepDefinition[];
    metadata: Record<string, unknown>;
}
export interface WorkflowStepDefinition {
    id: string;
    name: string;
    stepType: "action" | "approval" | "condition" | "notification" | "delay" | "evidence" | "remediation";
    handler: string;
    order: number;
    timeoutSeconds?: number;
    retryLimit: number;
    continueOnFailure: boolean;
    configuration: Record<string, unknown>;
}
export interface WorkflowExecution extends PersistentEntity {
    executionCode: string;
    workflowId: string;
    workflowCode: string;
    workflowVersion: number;
    status: WorkflowExecutionStatus;
    trigger: string;
    entityReference?: EntityReference;
    startedAt?: string;
    completedAt?: string;
    currentStepId?: string;
    steps: WorkflowStepExecution[];
    context: Record<string, unknown>;
    errorMessage?: string;
}
export interface WorkflowStepExecution {
    id: string;
    stepDefinitionId: string;
    name: string;
    status: "pending" | "running" | "waiting" | "completed" | "failed" | "skipped";
    attempts: number;
    startedAt?: string;
    completedAt?: string;
    output?: Record<string, unknown>;
    errorMessage?: string;
}
export interface PlatformEvent extends PersistentEntity {
    eventCode: string;
    eventType: string;
    source: string;
    severity: EnterpriseSeverity;
    entityReference?: EntityReference;
    payload: Record<string, unknown>;
    correlationId?: string;
    causationId?: string;
    occurredAt: string;
    processedAt?: string;
    processingStatus: "pending" | "processing" | "processed" | "failed";
    retryCount: number;
    errorMessage?: string;
}
export interface MegaPack6Status {
    success: boolean;
    system: string;
    version: string;
    timestamp: string;
    capabilities: Record<string, boolean>;
    metrics: Record<string, unknown>;
}
