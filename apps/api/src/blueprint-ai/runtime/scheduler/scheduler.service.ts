import { Injectable } from "@nestjs/common";

@Injectable()
export class SchedulerService{

 execute(context:any){
   return {
      module:"scheduler",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
