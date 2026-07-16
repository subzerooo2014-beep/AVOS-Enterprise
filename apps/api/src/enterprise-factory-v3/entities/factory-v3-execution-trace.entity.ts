export interface FactoryV3ExecutionTrace {
  id: string;
  jobId: string;
  stage: string;
  durationMs: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}