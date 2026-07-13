export interface WorkflowContext {
  workflowId: string;
  executionId: string;
  correlationId?: string;
  variables: Record<string, any>;
  metadata?: Record<string, any>;
  currentState: string;
  retryCount: number;
}
