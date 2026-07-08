import { Injectable } from "@nestjs/common";
import { AgentPlannerService } from "../planner/agent-planner.service";
import { ConversationMemoryService } from "../memory/conversation-memory.service";
import { ContextBuilderService } from "../context/context-builder.service";

@Injectable()
export class AgentExecutorService{

 constructor(
  private planner:AgentPlannerService,
  private memory:ConversationMemoryService,
  private context:ContextBuilderService,
 ){}

 execute(sessionId:string,input:any){

   const history=this.memory.get(sessionId);

   const ctx=this.context.build(input,history);

   const plan=this.planner.plan(input.prompt);

   this.memory.append(sessionId,{
      role:"user",
      content:input.prompt
   });

   return{
      context:ctx,
      plan,
      status:"READY_FOR_PROVIDER"
   };

 }

}
