import { Injectable } from "@nestjs/common";
import { AgentRegistryService } from "../registry/agent-registry.service";
import { AgentPlanner } from "../planner/agent-planner.service";
import { AgentExecutor } from "../executor/agent-executor.service";

@Injectable()
export class MultiAgentCoordinator{

 constructor(
  private registry:AgentRegistryService,
  private planner:AgentPlanner,
  private executor:AgentExecutor,
 ){}

 run(agentId:string,goal:string){

   const agent=this.registry.find(agentId);

   const plan=this.planner.plan(goal);

   const result=this.executor.execute(plan);

   return{
      agent,
      result,
   };

 }

}
