import {CodeGenExecutionNode} from "../planner/codegen-execution-plan.contracts";

export class CodeGenDependencyGraph{
 build(nodes:CodeGenExecutionNode[]){
   return new Map(nodes.map(n=>[n.id,n]));
 }
 topological(nodes:CodeGenExecutionNode[]){
   return [...nodes].sort((a,b)=>a.priority-b.priority);
 }
}
