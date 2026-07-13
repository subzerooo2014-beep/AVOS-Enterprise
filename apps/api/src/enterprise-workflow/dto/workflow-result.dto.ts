export class WorkflowResultDto {
  success!: boolean;
  workflowId!: string;
  executionId!: string;
  state!: string;
  startedAt!: string;
  completedAt?: string;
  durationMs?: number;
  output?: Record<string, any>;
  errors?: string[];
}
