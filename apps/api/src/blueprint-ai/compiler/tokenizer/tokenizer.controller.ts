import { Body, Controller, Post } from "@nestjs/common";
import { TokenizerService } from "./tokenizer.service";

@Controller("compiler/tokenizer")
export class TokenizerController {

  constructor(
    private readonly service:TokenizerService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
