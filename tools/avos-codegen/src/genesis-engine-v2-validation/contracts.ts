export type ValidationPrimitive = string | number | boolean | null;
export type ValidationValue =
  | ValidationPrimitive
  | ValidationValue[]
  | { [key: string]: ValidationValue };

export enum ValidationGateStatus {
  PASSED = "passed",
  FAILED = "failed",
  SKIPPED = "skipped",
}

export enum ValidationPipelineStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum ValidationSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface ValidationFinding {
  code: string;
  severity: ValidationSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, ValidationValue>;
}

export interface ValidationGateDefinition {
  key: string;
  command: string;
  required: boolean;
  timeoutMs: number;
  weight: number;
}

export interface ValidationGateResult {
  key: string;
  status: ValidationGateStatus;
  required: boolean;
  exitCode: number | null;
  durationMs: number;
  output: string;
  score: number;
}

export interface ValidationEvidence {
  id: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, ValidationValue>;
  createdAt: string;
}
