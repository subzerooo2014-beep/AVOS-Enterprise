import { Controller, Get } from "@nestjs/common";

@Controller("blueprint/approval")
export class ApprovalController{
 @Get("status")
 status(){
   return {
     healthy:true,
     subsystem:"Blueprint Approval Workflow"
   };
 }
}
