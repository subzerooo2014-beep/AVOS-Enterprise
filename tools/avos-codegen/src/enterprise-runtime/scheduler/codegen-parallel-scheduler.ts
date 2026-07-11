import {CodeGenExecutionNode} from "../planner/codegen-execution-plan.contracts";
export class CodeGenParallelScheduler{
 schedule(nodes:CodeGenExecutionNode[]){
   return [...nodes].sort((a,b)=>a.priority-b.priority);
 }
}
