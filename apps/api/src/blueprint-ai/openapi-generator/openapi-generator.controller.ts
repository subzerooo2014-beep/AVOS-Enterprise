import { Body, Controller, Post } from "@nestjs/common";
import { OpenapiGeneratorService } from "./openapi-generator.service";

@Controller("openapi-generator")
export class OpenapiGeneratorController {

  constructor(
    private readonly service:OpenapiGeneratorService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
