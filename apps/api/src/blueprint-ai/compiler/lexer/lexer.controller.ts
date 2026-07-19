import { Body, Controller, Post } from "@nestjs/common";
import { LexerService } from "./lexer.service";

@Controller("compiler/lexer")
export class LexerController {

  constructor(
    private readonly service:LexerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
