export class CreateWorkflowDto {
  name!: string;

  description?: string;

  version?: string;

  payload?: Record<string, any>;

  metadata?: Record<string, any>;

  steps?: Array<{
    id: string;
    type: string;
    action: string;
    config?: Record<string, any>;
  }>;
}
