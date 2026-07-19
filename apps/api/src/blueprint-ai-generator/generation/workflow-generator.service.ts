import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowGeneratorService{
  generate(input?:any){
    return {
      success:true,
      service:"WorkflowGeneratorService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
