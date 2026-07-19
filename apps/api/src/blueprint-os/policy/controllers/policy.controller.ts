import { Controller, Get } from "@nestjs/common";

@Controller("blueprint/policy")
export class PolicyController{
  @Get("status")
  status(){
    return {
      healthy:true,
      subsystem:"Blueprint Policy Engine"
    };
  }
}
