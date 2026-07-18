export type FactoryPriority = "critical" | "high" | "normal" | "low";

export type FactoryWorkStatus =
  | "queued"
  | "planned"
  | "awaiting-approval"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export interface FactoryWorkItem {
  id: string;
  blueprintId: string;
  projectName: string;
  requestedBy: string;
  approvedBy?: string;
  priority: FactoryPriority;
  status: FactoryWorkStatus;
  dependencies: string[];
  estimatedUnits: number;
  allocatedUnits: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  qualityScore: number;
  diagnostics: string[];
}

export interface FactoryExecutionPlan {
  id: string;
  workItemId: string;
  stages: string[];
  dependencyOrder: string[];
  parallelGroups: string[][];
  requiredUnits: number;
  expectedQualityScore: number;
  risks: string[];
  createdAt: string;
}

export interface FactoryResourceSnapshot {
  totalUnits: number;
  availableUnits: number;
  allocatedUnits: number;
  activeWorkers: number;
  queueDepth: number;
}

export interface FactoryTelemetryEvent {
  id: string;
  type: string;
  workItemId?: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  payload: Record<string, unknown>;
}

export interface FactoryAnalytics {
  queueDepth: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageQualityScore: number;
  utilizationPercent: number;
  throughputPerHour: number;
  retryRatePercent: number;
}

export interface FactoryCertification {
  id: string;
  workItemId: string;
  certified: boolean;
  certifiedBy?: string;
  approvedBy?: string;
  score: number;
  findings: string[];
  createdAt: string;
}

export interface CreateFactoryWorkItemInput {
  blueprintId: string;
  projectName: string;
  requestedBy: string;
  priority?: FactoryPriority;
  dependencies?: string[];
  estimatedUnits?: number;
  maxRetries?: number;
}

export interface ApproveFactoryWorkItemInput {
  approvedBy: string;
}

export interface FactoryBundleVerification {
  classification: "autonomous-factory-orchestration-production-intelligence";
  version: "15.0.0";
  healthy: boolean;
  humanFinalAuthority: true;
  packs: number[];
  capabilities: string[];
  analytics: FactoryAnalytics;
  resources: FactoryResourceSnapshot;
}
