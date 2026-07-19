import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskManagerService{

 execute(context:any){
   return {
      module:"task-manager",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
