import { Injectable } from "@nestjs/common";

@Injectable()
export class PipelineEngineService{

 execute(context:any){
   return {
      module:"pipeline-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
