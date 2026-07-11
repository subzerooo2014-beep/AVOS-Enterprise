import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export enum CodeGenScheduleItemStatus {
  PENDING = "pending",
  READY = "ready",
  RUNNING = "running",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  SKIPPED = "skipped",
  RETRYING = "retrying",
}

export enum CodeGenConcurrencyMode {
  SERIAL = "serial",
  BOUNDED = "bounded",
  UNBOUNDED = "unbounded",
}

export interface CodeGenRetryPolicy {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

export interface CodeGenConcurrencyPolicy {
  mode: CodeGenConcurrencyMode;
  maxParallel: number;
  preserveStageOrder: boolean;
  failFast: boolean;
}

export interface CodeGenScheduleItem {
  artifactKey: string;
  stageIndex: number;
  priority: number;
  weight: number;
  dependencies: string[];
  status: CodeGenScheduleItemStatus;
  attempts: number;
  retryPolicy: CodeGenRetryPolicy;
  metadata: CodeGenMetadata;
}

export interface CodeGenExecutionScheduleStage {
  index: number;
  artifactKeys: string[];
  barrierBefore: boolean;
  barrierAfter: boolean;
  concurrency: number;
  estimatedWeight: number;
}

export interface CodeGenExecutionSchedule {
  id: string;
  executionId: string;
  policy: CodeGenConcurrencyPolicy;
  items: CodeGenScheduleItem[];
  stages: CodeGenExecutionScheduleStage[];
  totalWeight: number;
  estimatedParallelism: number;
  createdAt: string;
}

export interface CodeGenSchedulerResult {
  success: boolean;
  schedule?: CodeGenExecutionSchedule;
  warnings: string[];
  errors: string[];
  generatedAt: string;
}
