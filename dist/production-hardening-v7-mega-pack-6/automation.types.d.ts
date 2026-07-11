import { EnterpriseSeverity, PersistentEntity, WorkflowExecutionStatus } from "./types/mega-pack-6.types";
export type RemediationExecutionStatus = "draft" | "pending_approval" | "approved" | "queued" | "running" | "completed" | "partially_completed" | "failed" | "cancelled";
export interface AutomatedRemediation extends PersistentEntity {
    remediationCode: string;
    sourceType: string;
    sourceId: string;
    title: string;
    description: string;
    severity: EnterpriseSeverity;
    owner: string;
    priority: number;
    status: RemediationExecutionStatus;
    dueAt?: string;
    approvalRequestId?: string;
    workflowExecutionId?: string;
    startedAt?: string;
    completedAt?: string;
    actions: AutomatedRemediationAction[];
    metadata: Record<string, unknown>;
}
export interface AutomatedRemediationAction {
    id: string;
    name: string;
    handler: string;
    order: number;
    requiresApproval: boolean;
    retryLimit: number;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    attempts: number;
    configuration: Record<string, unknown>;
    output?: Record<string, unknown>;
    errorMessage?: string;
    startedAt?: string;
    completedAt?: string;
}
export interface EvidenceChainEntry extends PersistentEntity {
    sequenceNumber: number;
    evidenceCode: string;
    evidenceType: string;
    sourceType: string;
    sourceId: string;
    title: string;
    description: string;
    createdBy: string;
    payload: Record<string, unknown>;
    metadata: Record<string, unknown>;
    previousHash: string;
    payloadHash: string;
    chainHash: string;
    recordedAt: string;
}
export interface EvidenceChainVerification {
    verified: boolean;
    totalEntries: number;
    validEntries: number;
    invalidEntries: number;
    brokenAtSequence?: number;
    expectedHash?: string;
    observedHash?: string;
    verifiedAt: string;
}
export interface ControlSchedule extends PersistentEntity {
    scheduleCode: string;
    name: string;
    description: string;
    controlType: string;
    handler: string;
    frequency: "hourly" | "daily" | "weekly" | "monthly" | "manual";
    hour?: number;
    minute?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
    enabled: boolean;
    configuration: Record<string, unknown>;
    lastRunAt?: string;
    nextRunAt?: string;
    lastRunStatus?: WorkflowExecutionStatus;
    runCount: number;
    failureCount: number;
}
export interface SchedulerRun extends PersistentEntity {
    scheduleId: string;
    scheduleCode: string;
    startedAt: string;
    completedAt?: string;
    status: "running" | "completed" | "failed" | "skipped";
    handler: string;
    output?: Record<string, unknown>;
    errorMessage?: string;
    durationMs?: number;
}
