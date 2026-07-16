export interface DigitalWorkerRecord {
  id: string;
  name: string;
  role: string;
  version: string;
  status: "ACTIVE" | "PAUSED" | "RETIRED";
  capabilities: string[];
  allowedAutomations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationDefinitionRecord {
  id: string;
  name: string;
  domain: string;
  version: string;
  enabled: boolean;
  requiresApproval: boolean;
  steps: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationJobRecord {
  id: string;
  automationId: string;
  workerId?: string;
  status:
    | "QUEUED"
    | "WAITING_APPROVAL"
    | "RUNNING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";
  priority: number;
  payload: Record<string, unknown>;
  currentStep?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface AutomationApprovalRecord {
  id: string;
  jobId: string;
  approver: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface AutomationExecutionRecord {
  id: string;
  jobId: string;
  workerId: string;
  step: string;
  status: "STARTED" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

export interface AutomationMetrics {
  workers: number;
  activeWorkers: number;
  automations: number;
  enabledAutomations: number;
  jobs: number;
  queuedJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  pendingApprovals: number;
  executions: number;
}

export interface AutomationHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: AutomationMetrics;
  components: Record<string, string>;
}
