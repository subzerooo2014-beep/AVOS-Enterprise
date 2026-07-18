export interface GeneratorExecutionRequest {
  pluginId: string;
  target: string;
  input: unknown;
  metadata?: Record<string, unknown>;
}

export interface GeneratorExecutionContext {
  executionId: string;
  pluginId: string;
  target: string;
  startedAt: Date;
  metadata: Record<string, unknown>;
}

export interface GeneratorExecutionResult {
  executionId: string;
  success: boolean;
  pluginId: string;
  target: string;
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  output?: unknown;
  warnings: string[];
  errors: string[];
}
