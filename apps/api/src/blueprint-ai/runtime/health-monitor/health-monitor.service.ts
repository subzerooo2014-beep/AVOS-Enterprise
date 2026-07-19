import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthMonitorService{

 execute(context:any){
   return {
      module:"health-monitor",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
