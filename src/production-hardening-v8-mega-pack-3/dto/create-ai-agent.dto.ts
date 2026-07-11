export class CreateAiAgentDto {
  name!: string;
  code!: string;
  description?: string;
  version?: string;
  environment?: string;
  owner?: string;
  modelProvider!: string;
  modelName!: string;
  maximumConcurrentTasks?: number;
}
