import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentRouterService {

 route(task:any){

   if(task.type==="sales") return "sales";
   if(task.type==="inventory") return "inventory";
   if(task.type==="finance") return "finance";

   return "general";

 }

}
