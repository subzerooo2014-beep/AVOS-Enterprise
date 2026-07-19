import { Injectable } from "@nestjs/common";

@Injectable()
export class ApprovalEngineService{
 approve(request:any){
   return {
     approved:true,
     humanFinalAuthority:true,
     stage:1,
     decidedAt:new Date().toISOString()
   };
 }
}
