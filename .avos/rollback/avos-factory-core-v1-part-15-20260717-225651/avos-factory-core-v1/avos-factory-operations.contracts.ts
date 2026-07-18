export type AvosFactoryLifecycleState =
  | "created"
  | "starting"
  | "running"
  | "suspended"
  | "maintenance"
  | "stopping"
  | "stopped"
  | "failed";

export type AvosFactoryJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "dead-lettered"
  | "cancelled";

export interface AvosFactoryLifecycleSnapshot {
  system: "AVOS Factory Core V1";
  state: AvosFactoryLifecycleState;
  previousState?: AvosFactoryLifecycleState;
  reason?: string;
  changedBy: string;
  approvedBy?: string;
  humanApproved: boolean;
  changedAt: string;
}

export interface AvosFactoryJob {
  id: string;
  type:
    | "project-generation"
    | "project-execution"
    | "verification"
    | "certification"
    | "enterprise-synchronization"
    | "maintenance";
  subjectId: string;
  actor: string;
  approvedBy?: string;
  humanApproved: boolean;
  payload: Record<string, unknown>;
  status: AvosFactoryJobStatus;
  attempts: number;
  maxAttempts: number;
  priority: number;
  scheduledFor: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  lastError?: string;
}

export interface AvosFactoryDeadLetterRecord {
  id: string;
  jobId: string;
  jobType: AvosFactoryJob["type"];
  subjectId: string;
  actor: string;
  attempts: number;
  error: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AvosFactorySchedule {
  id: string;
  name: string;
  jobType: AvosFactoryJob["type"];
  subjectId: string;
  actor: string;
  approvedBy?: string;
  humanApproved: boolean;
  payload: Record<string, unknown>;
  runAt: string;
  enabled: boolean;
  createdAt: string;
}

export interface AvosFactoryOperationsMetrics {
  lifecycleState: AvosFactoryLifecycleState;
  queuedJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  deadLetterJobs: number;
  cancelledJobs: number;
  schedules: number;
  enabledSchedules: number;
  totalAttempts: number;
  retryCount: number;
  successRate: number;
  calculatedAt: string;
}

export interface AvosFactoryOperationsSmokeReport {
  id: string;
  success: boolean;
  score: number;
  checks: Record<string, boolean>;
  metrics: AvosFactoryOperationsMetrics;
  blockingFindings: string[];
  generatedAt: string;
}
