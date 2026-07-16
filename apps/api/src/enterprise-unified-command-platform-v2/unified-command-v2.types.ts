export interface CommandSourceV2 {
  id: string;
  name: string;
  platform: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  capabilities: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedCommandV2 {
  id: string;
  sourceId: string;
  commandType: string;
  target: string;
  status:
    | "CREATED"
    | "APPROVAL_REQUIRED"
    | "APPROVED"
    | "EXECUTING"
    | "COMPLETED"
    | "FAILED";
  priority: number;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface CommandApprovalV2 {
  id: string;
  commandId: string;
  approver: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface CommandSignalV2 {
  id: string;
  sourceId: string;
  category: string;
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  message: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface ExecutiveMetricV2 {
  id: string;
  name: string;
  value: number;
  unit: string;
  target?: number;
  trend: "UP" | "DOWN" | "STABLE";
  updatedAt: string;
}

export interface UnifiedCommandMetricsV2 {
  sources: number;
  onlineSources: number;
  commands: number;
  executingCommands: number;
  completedCommands: number;
  failedCommands: number;
  pendingApprovals: number;
  signals: number;
  criticalSignals: number;
  executiveMetrics: number;
}

export interface UnifiedCommandHealthV2 {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: UnifiedCommandMetricsV2;
  components: Record<string, string>;
}
