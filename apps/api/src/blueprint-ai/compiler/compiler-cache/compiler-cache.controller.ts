import { Body, Controller, Post } from "@nestjs/common";
import { CompilerCacheService } from "./compiler-cache.service";

@Controller("compiler/compiler-cache")
export class CompilerCacheController {

  constructor(
    private readonly service:CompilerCacheService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
