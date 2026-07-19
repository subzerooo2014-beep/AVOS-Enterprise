import { Body, Controller, Post } from "@nestjs/common";
import { AstValidatorService } from "./ast-validator.service";

@Controller("compiler/ast-validator")
export class AstValidatorController {

  constructor(
    private readonly service:AstValidatorService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
