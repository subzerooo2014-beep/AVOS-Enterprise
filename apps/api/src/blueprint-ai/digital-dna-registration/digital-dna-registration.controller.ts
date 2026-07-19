import { Body, Controller, Post } from "@nestjs/common";
import { DigitalDnaRegistrationService } from "./digital-dna-registration.service";

@Controller("digital-dna-registration")
export class DigitalDnaRegistrationController {

  constructor(
    private readonly service:DigitalDnaRegistrationService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
