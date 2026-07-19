import { Body, Controller, Post } from "@nestjs/common";
import { CapabilityRegistrationService } from "./capability-registration.service";

@Controller("capability-registration")
export class CapabilityRegistrationController {

  constructor(
    private readonly service:CapabilityRegistrationService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
