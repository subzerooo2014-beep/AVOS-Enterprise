import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentExecutor{

 execute(plan:any){

   return{
      status:"SUCCESS",
      completedSteps:plan.steps.length,
      plan,
   };

 }

}
