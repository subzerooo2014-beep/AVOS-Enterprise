import { Body, Controller, Post } from "@nestjs/common";
import { ArchitectureValidatorService } from "./architecture-validator.service";

@Controller("architecture-validator")
export class ArchitectureValidatorController {

  constructor(
    private readonly service:ArchitectureValidatorService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
