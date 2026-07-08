import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentPlanner{

 plan(goal:string){

   return{
      goal,
      steps:[
        "Analyze",
        "Search",
        "Reason",
        "Execute",
        "Validate"
      ]
   };

 }

}
