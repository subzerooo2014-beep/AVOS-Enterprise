import { Injectable } from "@nestjs/common";

@Injectable()
export class MetricsEngineService{

 execute(context:any){
   return {
      module:"metrics-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
