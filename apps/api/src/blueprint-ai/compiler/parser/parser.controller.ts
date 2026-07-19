import { Body, Controller, Post } from "@nestjs/common";
import { ParserService } from "./parser.service";

@Controller("compiler/parser")
export class ParserController {

  constructor(
    private readonly service:ParserService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
