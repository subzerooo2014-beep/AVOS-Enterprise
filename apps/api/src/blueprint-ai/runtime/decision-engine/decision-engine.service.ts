import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionEngineService{

 execute(context:any){
   return {
      module:"decision-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
