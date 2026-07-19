import { Controller, Get } from "@nestjs/common";

@Controller("blueprint/governance")
export class GovernanceController{
  @Get("status")
  status(){
    return {
      healthy:true,
      subsystem:"Blueprint Governance Core"
    };
  }
}
