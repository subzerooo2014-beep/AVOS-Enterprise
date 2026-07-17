export type FactoryOperationalLevel =
  | "healthy"
  | "warning"
  | "critical";

export interface FactoryOperationalPolicy {
  maxConcurrentExecutions: number;
  maxExecutionsPerActorPerHour: number;
  idempotencyRetentionMinutes: number;
  lockTimeoutSeconds: number;
  auditRetention: number;
  requireHumanApprovalForOverwrite: true;
  requireHumanApprovalForRollback: true;
  requireHumanApprovalForCertification: true;
}

export interface FactoryExecutionLease {
  id: string;
  resourceKey: string;
  owner: string;
  acquiredAt: string;
  expiresAt: string;
  releasedAt?: string;
  active: boolean;
}

export interface FactoryIdempotencyRecord<T = unknown> {
  key: string;
  operation: string;
  actor: string;
  status: "processing" | "completed" | "failed";
  result?: T;
  error?: string;
  createdAt: string;
  expiresAt: string;
}

export interface FactoryAuditEvent {
  id: string;
  category:
    | "governance"
    | "execution"
    | "security"
    | "verification"
    | "certification"
    | "operations";
  action: string;
  actor: string;
  approvedBy?: string;
  success: boolean;
  correlationId?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface FactoryHealthReport {
  system: "AVOS Factory Core V1";
  status: FactoryOperationalLevel;
  score: number;
  checks: Record<string, boolean>;
  metrics: {
    activeLeases: number;
    idempotencyRecords: number;
    auditEvents: number;
    executionHistoryRecords: number;
    registeredProjectKinds: number;
  };
  reasons: string[];
  humanFinalAuthority: true;
  calculatedAt: string;
}

export interface FactoryReadinessReport {
  ready: boolean;
  score: number;
  productionHardening: true;
  operationalGovernance: boolean;
  concurrencyProtection: boolean;
  idempotencyProtection: boolean;
  immutableAuditFoundation: boolean;
  healthMonitoring: boolean;
  diagnostics: boolean;
  humanFinalAuthority: true;
  blockingFindings: string[];
  generatedAt: string;
}

export interface FactoryDiagnosticsReport {
  system: "AVOS Factory Core V1";
  version: "1.0.0";
  policy: FactoryOperationalPolicy;
  activeLeases: FactoryExecutionLease[];
  recentAuditEvents: FactoryAuditEvent[];
  health: FactoryHealthReport;
  readiness: FactoryReadinessReport;
  generatedAt: string;
}
