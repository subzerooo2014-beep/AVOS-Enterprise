import { Injectable } from "@nestjs/common";

@Injectable()
export class PlanningEngineService{

 execute(context:any){
   return {
      module:"planning-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
