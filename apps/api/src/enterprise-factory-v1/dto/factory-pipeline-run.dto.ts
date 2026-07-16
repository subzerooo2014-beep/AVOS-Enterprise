export class CreateFactoryPipelineRunDto {
  id!: string;
  jobId!: string;
  stage!: string;
  status!: string;
  startedAt!: string;
  finishedAt?: string;
}

export class UpdateFactoryPipelineRunDto {
  id?: string;
  jobId?: string;
  stage?: string;
  status?: string;
  startedAt?: string;
  finishedAt?: string;
}