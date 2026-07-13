export class WorkflowStepEntity {
  stepId!: string;
  workflowId!: string;
  name!: string;
  type!: string;
  order!: number;
  state!: string;
  action!: string;
  startedAt?: string;
  completedAt?: string;
  retries!: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
}
