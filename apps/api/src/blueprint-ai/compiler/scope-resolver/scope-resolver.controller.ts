import { Body, Controller, Post } from "@nestjs/common";
import { ScopeResolverService } from "./scope-resolver.service";

@Controller("compiler/scope-resolver")
export class ScopeResolverController {

  constructor(
    private readonly service:ScopeResolverService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
