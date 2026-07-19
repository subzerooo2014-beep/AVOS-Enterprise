import { Body, Controller, Post } from "@nestjs/common";
import { DependencyResolverService } from "./dependency-resolver.service";

@Controller("dependency-resolver")
export class DependencyResolverController {

  constructor(
    private readonly service:DependencyResolverService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
