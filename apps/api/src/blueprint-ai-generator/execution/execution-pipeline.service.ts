import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionPipelineService{
  execute(input?:any){
    return {
      success:true,
      service:"ExecutionPipelineService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
