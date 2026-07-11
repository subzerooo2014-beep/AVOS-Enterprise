import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowEngineService {

  execute(workflow:any){

    return{
      workflowId: crypto.randomUUID(),
      status:"RUNNING",
      startedAt:new Date().toISOString(),
      workflow,
    };

  }

}
