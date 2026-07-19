import { Body, Controller, Post } from "@nestjs/common";
import { TypeResolverService } from "./type-resolver.service";

@Controller("compiler/type-resolver")
export class TypeResolverController {

  constructor(
    private readonly service:TypeResolverService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
