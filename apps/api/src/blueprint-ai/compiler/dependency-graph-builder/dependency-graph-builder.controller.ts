import { Body, Controller, Post } from "@nestjs/common";
import { DependencyGraphBuilderService } from "./dependency-graph-builder.service";

@Controller("compiler/dependency-graph-builder")
export class DependencyGraphBuilderController {

  constructor(
    private readonly service:DependencyGraphBuilderService
  ){}

  @Post("execute")
  execute(@Body() body:any){
    return this.service.execute(body);
  }

}
