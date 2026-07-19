import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowOrchestratorService{
  generate(input?:any){
    return {
      success:true,
      component:"WorkflowOrchestratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
