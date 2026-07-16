export class CreateFactoryV3ExecutionTraceDto {
  id!: string;
  jobId!: string;
  stage!: string;
  durationMs!: number;
  success!: boolean;
  metadata?: Record<string, unknown>;
}

export class UpdateFactoryV3ExecutionTraceDto {
  id?: string;
  jobId?: string;
  stage?: string;
  durationMs?: number;
  success?: boolean;
  metadata?: Record<string, unknown>;
}