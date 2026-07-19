import { Body, Controller, Post } from "@nestjs/common";
import { AstBuilderService } from "./ast-builder.service";

@Controller("ast-builder")
export class AstBuilderController {

  constructor(
    private readonly service:AstBuilderService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
