import {
  ProjectExecutionInput,
  ProjectExecutionResult,
  ProjectRollbackRequest,
  ProjectRollbackResult
} from "./project-execution.contracts";

export interface FactoryEnforcedExecutionInput
  extends ProjectExecutionInput {
  idempotencyKey: string;
  actor: string;
}

export interface FactoryEnforcedExecutionResult {
  replayed: boolean;
  idempotencyKey: string;
  result: ProjectExecutionResult;
}

export interface FactoryEnforcedRollbackInput
  extends ProjectRollbackRequest {
  idempotencyKey: string;
}

export interface FactoryEnforcedRollbackResult {
  replayed: boolean;
  idempotencyKey: string;
  result: ProjectRollbackResult;
}

export interface FactoryEnforcementMetrics {
  executionsAttempted: number;
  executionsCompleted: number;
  executionsFailed: number;
  executionsReplayed: number;
  rollbacksAttempted: number;
  rollbacksCompleted: number;
  rollbacksFailed: number;
  rollbacksReplayed: number;
  certificationsAttempted: number;
  certificationsCompleted: number;
  certificationsRejected: number;
  locksAcquired: number;
  lockConflicts: number;
  quotaRejections: number;
  auditEventsWritten: number;
  calculatedAt: string;
}

export interface FactoryEnforcementSmokeResult {
  success: boolean;
  checks: Record<string, boolean>;
  metrics: FactoryEnforcementMetrics;
  generatedAt: string;
  error?: string;
}
