import { Injectable } from "@nestjs/common";
@Injectable()
export class AiInfrastructureDashboardService {
  summary(){
    return {
      models:0,
      prompts:0,
      vectorCollections:0,
      ragPipelines:0,
      evaluationSuites:0,
      fineTuningJobs:0,
      guardrails:0,
      healthStatus:"healthy",
    };
  }
}
