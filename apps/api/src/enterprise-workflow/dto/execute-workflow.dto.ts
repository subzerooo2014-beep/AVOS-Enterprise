export class ExecuteWorkflowDto {
  workflowId!: string;
  input?: Record<string, any>;
  context?: Record<string, any>;
  initiatedBy?: string;
  correlationId?: string;
  async?: boolean;
  timeoutMs?: number;
  retryOnFailure?: boolean;
}
