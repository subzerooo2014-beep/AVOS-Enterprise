import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionEngineService{

 execute(context:any){
   return {
      module:"execution-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
