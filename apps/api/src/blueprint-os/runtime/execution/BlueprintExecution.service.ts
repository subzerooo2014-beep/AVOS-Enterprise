import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintExecutionService{
 execute(plan:any){
   return {
     status:"running",
     startedAt:new Date().toISOString(),
     plan
   };
 }
}
