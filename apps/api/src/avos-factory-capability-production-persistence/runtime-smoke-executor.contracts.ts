export type RuntimeSmokeCheckStatus = "passed" | "failed" | "skipped";

export interface RuntimeSmokeCheck {
  name: string;
  status: RuntimeSmokeCheckStatus;
  message: string;
  durationMs: number;
}

export interface RuntimeSmokeExecutionRequest {
  workspacePath: string;
  expectedFiles?: string[];
  requireHumanFinalAuthority?: boolean;
}

export interface RuntimeSmokeExecutionResult {
  success: boolean;
  score: number;
  workspacePath: string;
  checks: RuntimeSmokeCheck[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  humanFinalAuthority: boolean;
}
