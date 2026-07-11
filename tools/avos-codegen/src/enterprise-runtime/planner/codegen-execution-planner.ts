import {CodeGenExecutionNode,CodeGenExecutionPlan} from "./codegen-execution-plan.contracts";
import {CodeGenDependencyGraph} from "../graph/codegen-dependency-graph";
import {CodeGenParallelScheduler} from "../scheduler/codegen-parallel-scheduler";

export class CodeGenExecutionPlanner{
 private readonly graph=new CodeGenDependencyGraph();
 private readonly scheduler=new CodeGenParallelScheduler();

 create(nodes:CodeGenExecutionNode[]):CodeGenExecutionPlan{
   this.graph.build(nodes);
   return{
      nodes:this.scheduler.schedule(nodes),
      createdAt:new Date().toISOString()
   };
 }
}
