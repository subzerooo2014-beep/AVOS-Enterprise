import { Injectable } from "@nestjs/common";

@Injectable()
export class CrmAiService{
 analyze(customer:any){
   return{
     score:92,
     churnRisk:"LOW",
     nextAction:"Schedule follow-up",
   };
 }
}
