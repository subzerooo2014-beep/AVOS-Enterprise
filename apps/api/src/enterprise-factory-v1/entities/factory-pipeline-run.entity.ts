export interface FactoryPipelineRun {
  id: string;
  jobId: string;
  stage: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
}