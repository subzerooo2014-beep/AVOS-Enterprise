import { Injectable } from "@nestjs/common";
import { AgentTask } from "../agents/agent-task.interface";

@Injectable()
export class AgentPlannerService{

 plan(goal:string):AgentTask{

   return{
      id:crypto.randomUUID(),
      goal,
      priority:100,
      tools:[
        "search",
        "pricing",
        "inventory",
        "crm"
      ]
   };

 }

}
