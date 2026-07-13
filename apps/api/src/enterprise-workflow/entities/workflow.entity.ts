export class WorkflowEntity {
  workflowId!: string;
  name!: string;
  version!: string;
  state!: string;
  createdAt!: string;
  updatedAt!: string;
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
}
