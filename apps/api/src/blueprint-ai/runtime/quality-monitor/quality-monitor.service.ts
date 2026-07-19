import { Injectable } from "@nestjs/common";

@Injectable()
export class QualityMonitorService{

 execute(context:any){
   return {
      module:"quality-monitor",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
