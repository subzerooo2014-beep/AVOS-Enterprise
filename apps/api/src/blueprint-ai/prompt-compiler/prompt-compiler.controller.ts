import { Body, Controller, Post } from "@nestjs/common";
import { PromptCompilerService } from "./prompt-compiler.service";

@Controller("prompt-compiler")
export class PromptCompilerController {

  constructor(
    private readonly service:PromptCompilerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
