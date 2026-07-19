import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionPlannerService{
 plan(bp:any){
   return {
     success:true,
     stages:["validate","resolve","compile","execute"]
   };
 }
}
